"""LangGraph state management for Venture Autopsy."""

import operator
from typing import Annotated, TypedDict


class InvestigationState(TypedDict):
    """The complete state passing through the LangGraph orchestrator."""
    investigation_id: str
    
    # Inputs
    input_type: str
    input_data: dict
    
    # Aggregated Context
    shared_context: Annotated[list[dict], operator.add]
    
    # Results
    findings: Annotated[list[dict], operator.add]
    risks: Annotated[list[dict], operator.add]
    opportunities: Annotated[list[dict], operator.add]
    recommendations: Annotated[list[dict], operator.add]
    
    # Agent Outcomes
    agent_verdicts: Annotated[list[dict], operator.add]
    
    # Flow Control
    specialist_requests: Annotated[list[dict], operator.add]
    recruited_specialists: list[str]
    conflicts: list[dict]
    
    # Final Output
    report: dict
    status: str
    progress: int
    error: str | None
    
    # Phase 5 Conflict Resolution
    resolution_verdict: str
    resolution_reasoning: str
