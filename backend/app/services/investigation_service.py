"""Investigation management service."""

import asyncio
from app.database import get_supabase
from app.agents.orchestrator import run_investigation
from app.services.gemini import GeminiService

class InvestigationService:
    def __init__(self):
        from app.api.deps import get_event_bus
        self.db = get_supabase()
        self.provider_router = GeminiService()
        self.event_bus = get_event_bus()

    def create_investigation(self, title: str, description: str, input_type: str, input_data: dict) -> dict:
        data = {
            "title": title,
            "description": description,
            "input_type": input_type,
            "input_data": input_data,
            "status": "pending"
        }
        res = self.db.table("investigations").insert(data).execute()
        return res.data[0]

    def get_investigation(self, id: str) -> dict:
        res = self.db.table("investigations").select("*").eq("id", id).execute()
        return res.data[0] if res.data else None

    def list_investigations(self, limit: int = 50, offset: int = 0, status: str = None) -> list[dict]:
        query = self.db.table("investigations").select("*")
        if status:
            query = query.eq("status", status)
        res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        return res.data

    def start_investigation(self, id: str):
        # Run in background
        asyncio.create_task(run_investigation(
            investigation_id=id,
            db=self.db,
            gemini_service=self.provider_router,
            event_bus=self.event_bus
        ))

    def delete_investigation(self, id: str):
        self.db.table("investigations").delete().eq("id", id).execute()

    def update_status(self, id: str, status: str, progress: int):
        self.db.table("investigations").update({"status": status, "progress": progress}).eq("id", id).execute()

_investigation_service = None

def get_investigation_service() -> InvestigationService:
    global _investigation_service
    if _investigation_service is None:
        _investigation_service = InvestigationService()
    return _investigation_service
