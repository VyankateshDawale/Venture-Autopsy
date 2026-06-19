from pydantic import BaseModel, Field
from typing import Literal

class ConflictTopic(BaseModel):
    topic: str
    description: str

class ConflictArgument(BaseModel):
    argument: str
    source_agent: str

class ConflictAgentOutput(BaseModel):
    agent: Literal["conflict_resolution"]
    conflicts: list[ConflictTopic]
    supporting_arguments: list[ConflictArgument]
    opposing_arguments: list[ConflictArgument]
    resolution_verdict: Literal["approve", "review", "reject"]
    resolution_reasoning: str
    confidence: float = Field(..., ge=0.0, le=1.0)

from uuid import UUID
from datetime import datetime

class ConflictParticipantResponse(BaseModel):
    id: UUID
    conflict_id: UUID
    agent_id: UUID
    agent_type: str
    stance: str
    created_at: datetime

class ConflictResponse(BaseModel):
    id: UUID
    investigation_id: UUID
    title: str
    description: str
    status: str
    resolution_verdict: str | None = None
    resolution_reasoning: str | None = None
    created_at: datetime
    updated_at: datetime
    participants: list[ConflictParticipantResponse] = []
