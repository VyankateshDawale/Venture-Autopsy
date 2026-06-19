from __future__ import annotations
from datetime import datetime
from typing import Literal
from uuid import UUID
from pydantic import BaseModel, Field

VerdictLevel = Literal[
    "strong_approve",
    "approve",
    "conditional_approve",
    "neutral",
    "review",
    "reject",
    "strong_reject",
]

class AgentFinding(BaseModel):
    agent_type: str
    topic: str
    description: str

class Opportunity(BaseModel):
    agent_type: str
    title: str
    description: str
    severity: str

class Risk(BaseModel):
    agent_type: str
    title: str
    description: str
    severity: str

class SpecialistFinding(BaseModel):
    domain: str
    topic: str
    finding: str

class ConflictArgument(BaseModel):
    argument: str
    source_agent: str

class ConflictResolutionSection(BaseModel):
    topic: str
    description: str
    supporting_arguments: list[ConflictArgument]
    opposing_arguments: list[ConflictArgument]
    resolution_verdict: VerdictLevel
    resolution_reasoning: str

class ExecutiveDecisionSection(BaseModel):
    approval_status: VerdictLevel
    decision_rationale: str
    confidence: float

class FailureScenario(BaseModel):
    scenario: str
    cause: str
    impact: str
    probability: float

class MitigationStrategy(BaseModel):
    scenario: str
    strategy: str

class FinalScorecard(BaseModel):
    final_score: int
    survival_probability: int
    risk_summary: str

class CompiledReport(BaseModel):
    """Complete, deterministically compiled investigation report."""
    id: UUID
    investigation_id: UUID
    
    # 10 Required Sections
    executive_summary: str
    agent_findings: list[AgentFinding] = Field(default_factory=list)
    opportunities: list[Opportunity] = Field(default_factory=list)
    risks: list[Risk] = Field(default_factory=list)
    specialist_findings: list[SpecialistFinding] = Field(default_factory=list)
    conflicts: list[ConflictResolutionSection] = Field(default_factory=list)
    executive_decision: ExecutiveDecisionSection
    failure_scenarios: list[FailureScenario] = Field(default_factory=list)
    mitigation_strategies: list[MitigationStrategy] = Field(default_factory=list)
    scorecard: FinalScorecard
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"from_attributes": True}

ReportResponse = CompiledReport
