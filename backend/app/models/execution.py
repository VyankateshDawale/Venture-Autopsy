from pydantic import BaseModel, Field
from typing import Literal

class ExecutionRisk(BaseModel):
    title: str
    description: str
    category: Literal["risk"]
    severity: Literal["critical", "high", "medium", "low"]

class ExecutionOpportunity(BaseModel):
    title: str
    description: str
    category: Literal["opportunity"]
    severity: str

class ResourceRequirement(BaseModel):
    resource: str
    justification: str

class ExecutionChallenge(BaseModel):
    challenge: str
    impact: str

class InfrastructureRequirement(BaseModel):
    requirement: str
    cost_estimate: str

class ExecutionAgentOutput(BaseModel):
    agent: Literal["execution"]
    summary: str
    risks: list[ExecutionRisk]
    opportunities: list[ExecutionOpportunity]
    resource_requirements: list[ResourceRequirement]
    execution_challenges: list[ExecutionChallenge]
    time_to_market_estimate: str
    infrastructure_requirements: list[InfrastructureRequirement]
    execution_score: int = Field(..., ge=0, le=100)
    recommendation: Literal["approve", "review", "reject"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    needs_specialist: bool = False
    specialist_type: str | None = None
