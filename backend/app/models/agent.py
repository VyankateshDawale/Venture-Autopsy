"""Pydantic models for the Investigation Agent resource."""

from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.finding import FindingResponse


AgentRole = str

AgentStatus = Literal[
    "pending",
    "joining",
    "joined",
    "analyzing",
    "awaiting_input",
    "completed",
    "error",
]

VerdictLevel = Literal[
    "strong_approve",
    "approve",
    "conditional_approve",
    "neutral",
    "reject",
    "strong_reject",
]


class AgentResponse(BaseModel):
    """Agent summary used in list views."""

    id: UUID
    investigation_id: UUID
    agent_type: str
    agent_name: str
    role: AgentRole
    status: AgentStatus
    band_agent_id: str | None = None
    verdict: VerdictLevel | None = None
    verdict_reasoning: str | None = None
    confidence: float | None = Field(None, ge=0.0, le=1.0)
    analysis_summary: str | None = None
    joined_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AgentDetailResponse(BaseModel):
    """Full agent detail with its associated findings."""

    id: UUID
    investigation_id: UUID
    agent_type: str
    agent_name: str
    role: AgentRole
    status: AgentStatus
    band_agent_id: str | None = None
    verdict: VerdictLevel | None = None
    verdict_reasoning: str | None = None
    confidence: float | None = Field(None, ge=0.0, le=1.0)
    analysis_summary: str | None = None
    joined_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime
    findings: list[FindingResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class RecruitSpecialist(BaseModel):
    """Request body for recruiting a specialist agent."""

    agent_type: str = Field(
        ...,
        min_length=1,
        description="Type key, e.g. 'cybersecurity', 'healthcare', 'fintech'",
    )
    reason: str | None = Field(None, max_length=2000)
