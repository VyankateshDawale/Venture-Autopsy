from pydantic import BaseModel, Field
from typing import Literal

class RiskItem(BaseModel):
    title: str
    description: str
    category: Literal["risk"]
    severity: Literal["critical", "high", "medium", "low"]

class OpportunityItem(BaseModel):
    title: str
    description: str
    category: Literal["opportunity"]
    severity: str

class ComplianceIssue(BaseModel):
    framework: str
    description: str

class SecurityConcern(BaseModel):
    vulnerability: str
    description: str

class RiskAgentOutput(BaseModel):
    agent: Literal["risk"]
    summary: str
    risks: list[RiskItem]
    opportunities: list[OpportunityItem]
    compliance_issues: list[ComplianceIssue]
    security_concerns: list[SecurityConcern]
    risk_score: int = Field(..., ge=0, le=100)
    recommendation: Literal["approve", "review", "reject"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    needs_specialist: bool = False
    specialist_type: str | None = None
