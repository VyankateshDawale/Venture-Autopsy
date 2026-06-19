from pydantic import BaseModel, Field
from typing import Literal

class Competitor(BaseModel):
    name: str = Field(..., description="Name of the competitor")
    threat_level: Literal["high", "medium", "low"] = Field(..., description="Threat level posed by the competitor")
    differentiation: str = Field(..., description="How the target differentiates from this competitor")

class MarketOpportunity(BaseModel):
    title: str
    description: str
    category: Literal["opportunity"]
    severity: str

class MarketRisk(BaseModel):
    title: str
    description: str
    category: Literal["risk"]
    severity: Literal["critical", "high", "medium", "low"]

class MarketAgentOutput(BaseModel):
    agent: Literal["market"]
    summary: str = Field(..., description="Concise summary of the market analysis")
    opportunities: list[MarketOpportunity]
    risks: list[MarketRisk]
    competitors: list[Competitor]
    market_score: int = Field(..., ge=0, le=100)
    recommendation: Literal["approve", "review", "reject"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    needs_specialist: bool = False
    specialist_type: str | None = None
