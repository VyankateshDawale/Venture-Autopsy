from pydantic import BaseModel, Field
from typing import Literal

class ExecutiveAgentOutput(BaseModel):
    agent: Literal["executive_review"]
    executive_summary: str
    key_opportunities: list[str]
    key_risks: list[str]
    approval_status: Literal["approve", "review", "reject"]
    final_score: int = Field(..., ge=0, le=100)
    decision_rationale: str
    confidence: float = Field(..., ge=0.0, le=1.0)
