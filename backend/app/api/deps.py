from __future__ import annotations

import os
from typing import Annotated

from fastapi import Depends
from supabase import Client

from app.config import settings
from app.database import get_supabase
from app.services.event_bus import EventBus

# ── Singleton instances ──────────────────────────────────────────

_event_bus: EventBus | None = None

def get_event_bus() -> EventBus:
    """Return the application-wide EventBus singleton."""
    global _event_bus
    if _event_bus is None:
        _event_bus = EventBus()
    return _event_bus

EventBusDep = Annotated[EventBus, Depends(get_event_bus)]
SupabaseDep = Annotated[Client, Depends(get_supabase)]
