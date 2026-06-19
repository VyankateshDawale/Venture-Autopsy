from pydantic import BaseModel, Field
from typing import Literal

class FailureScenario(BaseModel):
    scenario: str
    cause: str
    impact: Literal["critical", "high", "medium", "low"]
    probability: float = Field(..., ge=0.0, le=1.0)

class Mitigation(BaseModel):
    scenario: str
    strategy: str

class FailureAgentOutput(BaseModel):
    agent: Literal["failure_simulation"]
    failure_scenarios: list[FailureScenario]
    mitigations: list[Mitigation]
    risk_summary: str
    survival_probability: int = Field(..., ge=0, le=100)
