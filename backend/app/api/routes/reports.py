"""Report retrieval and generation routes."""

from __future__ import annotations

import asyncio
import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.api.deps import SupabaseDep, EventBusDep
from app.services.gemini import GeminiService
from app.config import settings
from app.models.report import ReportResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/reports/{investigation_id}", response_model=ReportResponse)
async def get_report(investigation_id: UUID, db: SupabaseDep) -> ReportResponse:
    """Return the completed report for an investigation."""
    result = (
        db.table("reports")
        .select("*")
        .eq("investigation_id", str(investigation_id))
        .maybe_single()
        .execute()
    )
    if not result or not hasattr(result, 'data') or not result.data:
        raise HTTPException(status_code=404, detail="Report not found for this investigation")
    report_data = result.data[0] if isinstance(result.data, list) else result.data
    return ReportResponse(**report_data)


@router.post("/reports/{investigation_id}/generate")
async def generate_report(
    investigation_id: UUID,
    db: SupabaseDep,
    
    event_bus: EventBusDep,
) -> dict[str, str]:
    """Trigger report generation as a background task."""
    inv = db.table("investigations").select("id, status").eq("id", str(investigation_id)).maybe_single().execute()
    if not inv or not hasattr(inv, 'data') or not inv.data:
        raise HTTPException(status_code=404, detail="Investigation not found")

    from app.services.report_generator import ReportGenerator

    provider_router = GeminiService(settings)

    async def _generate() -> None:
        try:
            db.table("investigations").update(
                {"status": "generating_report"}
            ).eq("id", str(investigation_id)).execute()

            await event_bus.emit(str(investigation_id), "report_generated", {"status": "generating"})

            # Gather all data for the report
            findings_result = (
                db.table("findings")
                .select("*")
                .eq("investigation_id", str(investigation_id))
                .execute()
            )
            agents_result = (
                db.table("investigation_agents")
                .select("*")
                .eq("investigation_id", str(investigation_id))
                .execute()
            )
            conflicts_result = (
                db.table("conflicts")
                .select("*")
                .eq("investigation_id", str(investigation_id))
                .execute()
            )

            verdicts = [
                {
                    "agent_type": a["agent_type"],
                    "agent_name": a["agent_name"],
                    "role": a["role"],
                    "verdict": a.get("verdict"),
                    "confidence": a.get("confidence"),
                    "reasoning": a.get("verdict_reasoning", ""),
                }
                for a in (agents_result.data or [])
                if a.get("verdict")
            ]

            generator = ReportGenerator()
            report = await generator.generate_report(
                investigation_id=str(investigation_id),
                findings=findings_result.data or [],
                verdicts=verdicts,
                conflicts=conflicts_result.data or [],
                provider_router=provider_router,
                db=db,
            )

            await event_bus.emit(
                str(investigation_id),
                "report_generated",
                {"status": "completed", "report_id": report.get("id")},
            )
        except Exception as exc:
            logger.exception("Report generation failed for %s", investigation_id)
            await event_bus.emit(
                str(investigation_id),
                "investigation_failed",
                {"error": str(exc)},
            )

    asyncio.create_task(_generate())
    return {"status": "generating", "investigation_id": str(investigation_id)}
