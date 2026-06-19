from pydantic import BaseModel, Field
from typing import Literal

class SpecialistRisk(BaseModel):
    title: str
    description: str
    category: Literal["risk"]
    severity: Literal["critical", "high", "medium", "low"]

class SpecialistOpportunity(BaseModel):
    title: str
    description: str
    category: Literal["opportunity"]
    severity: str

class ExpertFinding(BaseModel):
    topic: str
    finding: str

class SpecialistAgentOutput(BaseModel):
    agent: Literal["specialist"]
    domain: str
    summary: str
    risks: list[SpecialistRisk]
    opportunities: list[SpecialistOpportunity]
    expert_findings: list[ExpertFinding]
    recommendation: Literal["approve", "review", "reject"]
    confidence: float = Field(..., ge=0.0, le=1.0)
