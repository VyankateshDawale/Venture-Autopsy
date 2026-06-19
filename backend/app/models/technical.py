from pydantic import BaseModel, Field
from typing import Literal

class TechnicalRisk(BaseModel):
    title: str
    description: str
    category: Literal["risk"]
    severity: Literal["critical", "high", "medium", "low"]

class TechnicalOpportunity(BaseModel):
    title: str
    description: str
    category: Literal["opportunity"]
    severity: str

class ArchitectureFinding(BaseModel):
    component: str
    finding: str

class TechnicalDebt(BaseModel):
    area: str
    description: str

class DependencyRisk(BaseModel):
    dependency: str
    risk: str

class ScalabilityConcern(BaseModel):
    bottleneck: str
    impact: str

class TechnicalAgentOutput(BaseModel):
    agent: Literal["technical"]
    summary: str
    risks: list[TechnicalRisk]
    opportunities: list[TechnicalOpportunity]
    architecture_findings: list[ArchitectureFinding]
    technical_debt: list[TechnicalDebt]
    dependency_risks: list[DependencyRisk]
    scalability_concerns: list[ScalabilityConcern]
    technical_score: int = Field(..., ge=0, le=100)
    recommendation: Literal["approve", "review", "reject"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    needs_specialist: bool = False
    specialist_type: str | None = None
