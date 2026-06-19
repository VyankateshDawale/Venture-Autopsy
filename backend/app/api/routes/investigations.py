"""Investigation CRUD routes."""

from __future__ import annotations

import asyncio
import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import SupabaseDep, EventBusDep
from app.services.gemini import GeminiService
from app.config import settings
from app.models.investigation import (
    CreateInvestigation,
    InvestigationDetailResponse,
    InvestigationResponse,
    InvestigationStatus,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/investigations", response_model=InvestigationResponse, status_code=201)
async def create_investigation(
    body: CreateInvestigation,
    db: SupabaseDep,
) -> InvestigationResponse:
    """Create a new investigation from the given input."""
    try:
        row = (
            db.table("investigations")
            .insert(
                {
                    "title": body.title,
                    "description": body.description,
                    "input_type": body.input_type,
                    "input_data": body.input_data,
                    "status": "pending",
                    "progress": 0,
                }
            )
            .execute()
        )
        if not row.data:
            raise HTTPException(status_code=500, detail="Failed to create investigation")
        return InvestigationResponse(**row.data[0])
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/investigations", response_model=list[InvestigationResponse])
async def list_investigations(
    db: SupabaseDep,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: InvestigationStatus | None = None,
) -> list[InvestigationResponse]:
    """List investigations with optional pagination and status filter."""
    query = db.table("investigations").select("*").order("created_at", desc=True)
    if status:
        query = query.eq("status", status)
    query = query.range(offset, offset + limit - 1)
    result = query.execute()
    return [InvestigationResponse(**r) for r in (result.data or [])]


@router.get("/investigations/{investigation_id}", response_model=InvestigationDetailResponse)
async def get_investigation(investigation_id: UUID, db: SupabaseDep) -> InvestigationDetailResponse:
    """Return full investigation detail with agent/finding counts."""
    inv = db.table("investigations").select("*").eq("id", str(investigation_id)).maybe_single().execute()
    if not inv or not hasattr(inv, 'data') or not inv.data:
        raise HTTPException(status_code=404, detail="Investigation not found")

    agent_count_result = (
        db.table("investigation_agents")
        .select("id", count="exact")
        .eq("investigation_id", str(investigation_id))
        .execute()
    )
    finding_count_result = (
        db.table("findings")
        .select("id", count="exact")
        .eq("investigation_id", str(investigation_id))
        .execute()
    )

    return InvestigationDetailResponse(
        **inv.data,
        agent_count=agent_count_result.count or 0,
        finding_count=finding_count_result.count or 0,
    )


@router.post("/investigations/{investigation_id}/start")
async def start_investigation(
    investigation_id: UUID,
    background_tasks: getattr(__import__("fastapi"), "BackgroundTasks"),
    db: SupabaseDep,
    event_bus: EventBusDep,
) -> dict[str, str]:
    """Trigger the LangGraph orchestrator as a background task."""
    inv = db.table("investigations").select("id, status").eq("id", str(investigation_id)).maybe_single().execute()
    if not inv or not hasattr(inv, 'data') or not inv.data:
        raise HTTPException(status_code=404, detail="Investigation not found")
    
    inv_data = inv.data[0] if isinstance(inv.data, list) else inv.data
    if inv_data["status"] not in ("pending", "failed"):
        raise HTTPException(status_code=409, detail=f"Cannot start investigation in '{inv_data['status']}' status")

    # Update status immediately
    db.table("investigations").update({"status": "initializing", "progress": 0, "error_message": None}).eq(
        "id", str(investigation_id)
    ).execute()

    try:
        from app.agents.orchestrator import run_investigation
        gemini_service = GeminiService()

        background_tasks.add_task(
            run_investigation,
            str(investigation_id),
            db,
            gemini_service,
            event_bus,
        )
        return {"status": "started", "investigation_id": str(investigation_id)}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/investigations/{investigation_id}")
async def delete_investigation(investigation_id: UUID, db: SupabaseDep) -> dict:
    """Delete an investigation and all related data (cascaded by DB)."""
    inv = db.table("investigations").select("id").eq("id", str(investigation_id)).maybe_single().execute()
    if not inv or not hasattr(inv, 'data') or not inv.data:
        raise HTTPException(status_code=404, detail="Investigation not found")
    db.table("investigations").delete().eq("id", str(investigation_id)).execute()
    return {"status": "deleted"}
