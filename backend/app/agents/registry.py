import logging
from typing import Type

from supabase import Client
from app.services.event_bus import EventBus
from app.services.gemini import GeminiService

from app.agents.base import BaseAgent
from app.agents.core.investment import InvestmentAgent
from app.agents.core.market import MarketAgent
from app.agents.core.technical import TechnicalAgent
from app.agents.core.risk import RiskAgent
from app.agents.core.execution import ExecutionAgent
from app.agents.core.executive import ExecutiveAgent
from app.agents.core.failure import FailureSimulationAgent
from app.agents.specialists.agent import SpecialistAgent
from app.services.conflict_resolution import ConflictResolverAgent

logger = logging.getLogger(__name__)

# Single unified configuration map. All use Gemini.
AGENT_CONFIGS = {
    "investment": {"name": "Investment Agent", "role": "Financial Analyst", "class": InvestmentAgent},
    "market": {"name": "Market Agent", "role": "Market Strategist", "class": MarketAgent},
    "technical": {"name": "Technical Agent", "role": "CTO / Tech Lead", "class": TechnicalAgent},
    "risk": {"name": "Risk Agent", "role": "Risk Manager", "class": RiskAgent},
    "execution": {"name": "Execution Agent", "role": "Operations Manager", "class": ExecutionAgent},
    "executive_review": {"name": "Executive Review Agent", "role": "Investment Committee Chair", "class": ExecutiveAgent},
    "failure_simulation": {"name": "Failure Simulation Agent", "role": "Pre-mortem Analyst", "class": FailureSimulationAgent},
    "conflict_resolution": {"name": "Conflict Resolution Agent", "role": "Mediator", "class": ConflictResolverAgent},
    
    # Specialists
    "cybersecurity": {"name": "Cybersecurity Specialist", "role": "Security Auditor", "class": SpecialistAgent},
    "healthcare": {"name": "Healthcare Specialist", "role": "Medical/Bio Expert", "class": SpecialistAgent},
    "fintech": {"name": "Fintech Specialist", "role": "FinServ Expert", "class": SpecialistAgent},
    "legal": {"name": "Legal Specialist", "role": "General Counsel", "class": SpecialistAgent},
    "infrastructure": {"name": "Infrastructure Specialist", "role": "Cloud Architect", "class": SpecialistAgent},
}

class AgentRegistry:
    @staticmethod
    def create_agent(
        agent_type: str,
        gemini_service: GeminiService,
        db: Client,
        event_bus: EventBus
    ) -> BaseAgent:
        config = AGENT_CONFIGS.get(agent_type)
        if not config:
            raise ValueError(f"Unknown agent type: {agent_type}")
            
        agent_cls = config["class"]
        return agent_cls(
            agent_type=agent_type,
            name=config["name"],
            role=config["role"],
            gemini_service=gemini_service,
            db=db,
            event_bus=event_bus
        )

    @staticmethod
    def create_specialist(
        domain: str,
        gemini_service: GeminiService,
        db: Client,
        event_bus: EventBus
    ) -> BaseAgent:
        return AgentRegistry.create_agent(domain, gemini_service, db, event_bus)

    @staticmethod
    def get_core_agent_types() -> list[str]:
        return ["investment", "market", "technical", "risk", "execution"]

    @staticmethod
    def get_specialist_types() -> list[str]:
        return ["cybersecurity", "healthcare", "fintech", "legal", "infrastructure"]
