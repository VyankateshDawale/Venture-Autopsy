"""Agent, finding, context, timeline, and conflict routes for an investigation."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import SupabaseDep, EventBusDep
from app.models.agent import AgentDetailResponse, AgentResponse, RecruitSpecialist
from app.models.conflict import ConflictParticipantResponse, ConflictResponse
from app.models.finding import FindingResponse, FindingCategory, FindingSeverity
from app.models.timeline import TimelineEventResponse
from app.agents.registry import AgentRegistry

router = APIRouter()
logger = logging.getLogger(__name__)


# ── Agents ───────────────────────────────────────────────────────


@router.get(
    "/investigations/{investigation_id}/agents",
    response_model=list[AgentResponse],
)
async def list_agents(investigation_id: UUID, db: SupabaseDep) -> list[AgentResponse]:
    """List all agents assigned to an investigation."""
    result = (
        db.table("investigation_agents")
        .select("*")
        .eq("investigation_id", str(investigation_id))
        .order("created_at")
        .execute()
    )
    agents_list = []
    for r in (result.data or []):
        agent_type = r.get("agent_type")
        config = AgentRegistry.AGENT_CONFIGS.get(agent_type)
        if config:
            r["role"] = config["role"]
        agents_list.append(AgentResponse(**r))
    return agents_list


@router.get(
    "/investigations/{investigation_id}/agents/{agent_id}",
    response_model=AgentDetailResponse,
)
async def get_agent(
    investigation_id: UUID,
    agent_id: UUID,
    db: SupabaseDep,
) -> AgentDetailResponse:
    """Return agent detail with its associated findings."""
    agent = (
        db.table("investigation_agents")
        .select("*")
        .eq("id", str(agent_id))
        .eq("investigation_id", str(investigation_id))
        .maybe_single()
        .execute()
    )
    if not agent.data:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent_data = dict(agent.data)
    agent_type = agent_data.get("agent_type")
    config = AgentRegistry.AGENT_CONFIGS.get(agent_type)
    if config:
        agent_data["role"] = config["role"]

    findings_result = (
        db.table("findings")
        .select("*")
        .eq("agent_id", str(agent_id))
        .order("created_at")
        .execute()
    )
    findings = [FindingResponse(**f) for f in (findings_result.data or [])]
    return AgentDetailResponse(**agent_data, findings=findings)


@router.post(
    "/investigations/{investigation_id}/recruit",
    response_model=AgentResponse,
    status_code=201,
)
async def recruit_specialist(
    investigation_id: UUID,
    body: RecruitSpecialist,
    db: SupabaseDep,
    event_bus: EventBusDep,
) -> AgentResponse:
    """Manually recruit a specialist agent into the investigation."""
    from app.agents.registry import AgentRegistry

    inv = db.table("investigations").select("id").eq("id", str(investigation_id)).maybe_single().execute()
    if not inv.data:
        raise HTTPException(status_code=404, detail="Investigation not found")

    specialist_types = AgentRegistry.get_specialist_types()
    if body.agent_type not in specialist_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown specialist type '{body.agent_type}'. Valid: {specialist_types}",
        )

    config = AgentRegistry.AGENT_CONFIGS[body.agent_type]

    row = (
        db.table("investigation_agents")
        .insert(
            {
                "investigation_id": str(investigation_id),
                "agent_type": body.agent_type,
                "agent_name": config["name"],
                "role": "specialist",
                "status": "pending",
            }
        )
        .execute()
    )
    if not row.data:
        raise HTTPException(status_code=500, detail="Failed to recruit specialist")

    await event_bus.emit(
        str(investigation_id),
        "specialist_recruited",
        {"agent_type": body.agent_type, "agent_name": config["name"], "reason": body.reason},
    )

    return AgentResponse(**row.data[0])


# ── Findings ─────────────────────────────────────────────────────


@router.get(
    "/investigations/{investigation_id}/findings",
    response_model=list[FindingResponse],
)
async def list_findings(
    investigation_id: UUID,
    db: SupabaseDep,
    category: FindingCategory | None = None,
    severity: FindingSeverity | None = None,
    agent_id: UUID | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> list[FindingResponse]:
    """List findings for an investigation with optional filters."""
    query = (
        db.table("findings")
        .select("*")
        .eq("investigation_id", str(investigation_id))
        .order("created_at", desc=True)
    )
    if category:
        query = query.eq("category", category)
    if severity:
        query = query.eq("severity", severity)
    if agent_id:
        query = query.eq("agent_id", str(agent_id))
    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return [FindingResponse(**r) for r in (result.data or [])]


# ── Shared Context ───────────────────────────────────────────────


@router.get("/investigations/{investigation_id}/context")
async def list_context(
    investigation_id: UUID,
    db: SupabaseDep,
) -> list[dict]:
    """List shared context entries for an investigation."""
    result = (
        db.table("shared_context")
        .select("*")
        .eq("investigation_id", str(investigation_id))
        .order("created_at")
        .execute()
    )
    return result.data or []


# ── Timeline ─────────────────────────────────────────────────────


@router.get(
    "/investigations/{investigation_id}/timeline",
    response_model=list[TimelineEventResponse],
)
async def list_timeline(
    investigation_id: UUID,
    db: SupabaseDep,
) -> list[TimelineEventResponse]:
    """List timeline events for an investigation, newest first."""
    result = (
        db.table("timeline_events")
        .select("*")
        .eq("investigation_id", str(investigation_id))
        .order("created_at", desc=True)
        .execute()
    )
    return [TimelineEventResponse(**r) for r in (result.data or [])]


# ── Conflicts ────────────────────────────────────────────────────


@router.get(
    "/investigations/{investigation_id}/conflicts",
    response_model=list[ConflictResponse],
)
async def list_conflicts(
    investigation_id: UUID,
    db: SupabaseDep,
) -> list[ConflictResponse]:
    """List conflicts with participant positions for an investigation."""
    conflicts_result = (
        db.table("conflicts")
        .select("*")
        .eq("investigation_id", str(investigation_id))
        .order("created_at")
        .execute()
    )
    conflicts: list[ConflictResponse] = []
    for c in conflicts_result.data or []:
        participants_result = (
            db.table("conflict_participants")
            .select("*")
            .eq("conflict_id", c["id"])
            .execute()
        )
        participants = [ConflictParticipantResponse(**p) for p in (participants_result.data or [])]
        conflicts.append(ConflictResponse(**c, participants=participants))
    return conflicts
