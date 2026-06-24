import json
import logging
from abc import ABC, abstractmethod
from typing import Any

from supabase import Client

from app.services.event_bus import EventBus
from app.services.gemini import GeminiService

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """
    Base class for all Agents in the Venture Autopsy pipeline.
    """

    def __init__(
        self,
        agent_type: str,
        name: str,
        role: str,
        gemini_service: GeminiService,
        db: Client,
        event_bus: EventBus,
    ) -> None:
        self.agent_type = agent_type
        self.name = name
        self.role = role
        self.gemini_service = gemini_service
        self.db = db
        self.event_bus = event_bus

    @abstractmethod
    async def analyze(
        self,
        investigation_id: str,
        input_data: dict[str, Any],
        shared_context: list[dict[str, Any]],
        agent_verdicts: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        """
        Main entry point for agent logic. Must return a dict matching the expected state updates.
        """
        pass

    async def _emit_timeline_event(
        self,
        investigation_id: str,
        title: str,
        description: str,
        event_type: str = "system",
        agent_id: str | None = None
    ) -> None:
        """Helper to emit a timeline event to the WebSocket."""
        await self.event_bus.emit(
            investigation_id=investigation_id,
            event_type="timeline_event",
            payload={
                "event_type": event_type,
                "title": title,
                "description": description,
                "agent_type": self.agent_type,
                "agent_name": self.name,
                "agent_id": agent_id
            }
        )

    async def _emit_finding(
        self,
        investigation_id: str,
        agent_id: str,
        category: str,
        severity: str,
        title: str,
        description: str
    ) -> None:
        """Helper to emit an individual finding event to the WebSocket."""
        await self.event_bus.emit(
            investigation_id=investigation_id,
            event_type="finding",
            payload={
                "agent_type": self.agent_type,
                "agent_name": self.name,
                "agent_id": agent_id,
                "title": title,
                "description": description,
                "category": category,
                "severity": severity
            }
        )

    async def _update_status(self, investigation_id: str, agent_id: str, status: str) -> None:
        """Update agent status over WS and save to DB."""
        try:
            db_role = "specialist" if self.agent_type in ["cybersecurity", "healthcare", "fintech", "legal", "infrastructure"] else "core"
            self.db.table("investigation_agents").upsert({
                "id": agent_id,
                "investigation_id": investigation_id,
                "agent_type": self.agent_type,
                "agent_name": self.name,
                "role": db_role,
                "status": status
            }).execute()
        except Exception as e:
            logger.error(f"Failed to upsert agent: {e}")

        payload = {
            "agent_type": self.agent_type,
            "name": self.name,
            "role": self.role,
            "status": status,
            "provider": "Gemini",
            "model": "gemini-flash-lite-latest",
            "agent_id": agent_id
        }
        await self.event_bus.emit(
            investigation_id=investigation_id,
            event_type="agent_status",
            payload=payload
        )
