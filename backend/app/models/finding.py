"""Pydantic models for the Finding resource."""

from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


FindingCategory = Literal[
    "finding",
    "risk",
    "opportunity",
    "recommendation",
    "red_flag",
    "strength",
]

FindingSeverity = Literal[
    "critical",
    "high",
    "medium",
    "low",
    "info",
]


class FindingCreate(BaseModel):
    """Schema used internally when an agent creates a finding."""

    investigation_id: UUID
    agent_id: UUID
    category: FindingCategory
    severity: FindingSeverity = "medium"
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1)
    evidence: str | None = None
    impact_area: str | None = None
    confidence: float = Field(0.5, ge=0.0, le=1.0)

    @field_validator("title")
    @classmethod
    def strip_title(cls, v: str) -> str:
        return v.strip()


class FindingResponse(BaseModel):
    """Finding representation returned to clients."""

    id: UUID
    investigation_id: UUID
    agent_id: UUID
    category: FindingCategory
    severity: FindingSeverity
    title: str
    description: str
    evidence: str | None = None
    impact_area: str | None = None
    confidence: float = Field(ge=0.0, le=1.0)
    created_at: datetime

    model_config = {"from_attributes": True}
