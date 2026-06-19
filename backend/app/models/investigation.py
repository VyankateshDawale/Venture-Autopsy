"""Pydantic models for the Investigation resource."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


InputType = Literal[
    "startup_idea",
    "pitch_deck",
    "github_repo",
    "enterprise_proposal",
]

InvestigationStatus = Literal[
    "pending",
    "initializing",
    "agents_joining",
    "analyzing",
    "recruiting_specialists",
    "conflict_resolution",
    "executive_review",
    "generating_report",
    "completed",
    "failed",
]


class CreateInvestigation(BaseModel):
    """Request body for creating a new investigation."""

    title: str = Field(..., min_length=1, max_length=300)
    description: str | None = Field(None, max_length=5000)
    input_type: InputType
    input_data: dict[str, Any] = Field(
        ...,
        description="Payload varies by input_type: startup_idea has 'idea', pitch_deck has 'file_id', etc.",
    )

    @field_validator("title")
    @classmethod
    def strip_title(cls, v: str) -> str:
        return v.strip()

    @field_validator("input_data")
    @classmethod
    def input_data_not_empty(cls, v: dict[str, Any]) -> dict[str, Any]:
        if not v:
            raise ValueError("input_data must contain at least one key")
        return v


class InvestigationResponse(BaseModel):
    """Lightweight investigation representation for list views."""

    id: UUID
    title: str
    description: str | None = None
    input_type: InputType
    status: InvestigationStatus
    progress: int = Field(ge=0, le=100)
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InvestigationDetailResponse(BaseModel):
    """Full investigation detail including counts and metadata."""

    id: UUID
    title: str
    description: str | None = None
    input_type: InputType
    input_data: dict[str, Any]
    status: InvestigationStatus
    progress: int = Field(ge=0, le=100)
    band_room_id: str | None = None
    error_message: str | None = None
    agent_count: int = 0
    finding_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InvestigationSummary(BaseModel):
    """Compact summary used inside reports and dashboards."""

    id: UUID
    title: str
    status: InvestigationStatus
    progress: int = Field(ge=0, le=100)

    model_config = {"from_attributes": True}
