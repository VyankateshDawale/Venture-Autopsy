"""Pydantic models for the Timeline Event resource."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel


TimelineEventType = Literal[
    "investigation_created",
    "investigation_started",
    "agent_joined",
    "agent_analyzing",
    "finding_added",
    "risk_added",
    "opportunity_added",
    "red_flag_added",
    "strength_added",
    "context_shared",
    "specialist_requested",
    "specialist_recruited",
    "conflict_detected",
    "conflict_resolution_started",
    "conflict_resolved",
    "executive_review_started",
    "verdict_submitted",
    "report_generated",
    "investigation_completed",
    "investigation_failed",
]


class TimelineEventResponse(BaseModel):
    """A single timeline event for an investigation."""

    id: UUID
    investigation_id: UUID
    agent_id: UUID | None = None
    event_type: TimelineEventType
    title: str
    description: str | None = None
    metadata: dict[str, Any] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
