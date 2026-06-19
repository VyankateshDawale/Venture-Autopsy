"""AsyncIO event bus for dispatching WebSocket events to investigation subscribers."""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

logger = logging.getLogger(__name__)


class WSEvent:
    """A WebSocket event dispatched through the event bus."""

    __slots__ = ("id", "investigation_id", "event_type", "payload", "timestamp")

    def __init__(
        self,
        investigation_id: str,
        event_type: str,
        payload: dict[str, Any] | None = None,
    ) -> None:
        self.id = str(uuid4())
        self.investigation_id = investigation_id
        self.event_type = event_type
        self.payload = payload or {}
        self.timestamp = datetime.now(timezone.utc).isoformat()

    def to_json(self) -> str:
        return json.dumps(
            {
                "id": self.id,
                "investigation_id": self.investigation_id,
                "type": self.event_type,
                "payload": self.payload,
                "timestamp": self.timestamp,
            }
        )


class EventBus:
    """Async pub/sub event bus keyed by investigation_id.

    Each subscriber gets its own ``asyncio.Queue`` so multiple WebSocket
    clients watching the same investigation each receive every event.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EventBus, cls).__new__(cls)
            cls._instance._subscribers = {}
            cls._instance._lock = asyncio.Lock()
        return cls._instance

    def __init__(self) -> None:
        pass

    async def subscribe(self, investigation_id: str) -> asyncio.Queue[WSEvent]:
        """Register a new subscriber queue for *investigation_id* and return it."""
        queue: asyncio.Queue[WSEvent] = asyncio.Queue()
        async with self._lock:
            self._subscribers.setdefault(investigation_id, []).append(queue)
        logger.info("EventBus: subscriber added for %s (total=%d)",
                     investigation_id, len(self._subscribers[investigation_id]))
        return queue

    async def unsubscribe(self, investigation_id: str, queue: asyncio.Queue[WSEvent]) -> None:
        """Remove a subscriber queue."""
        async with self._lock:
            queues = self._subscribers.get(investigation_id, [])
            if queue in queues:
                queues.remove(queue)
            if not queues:
                self._subscribers.pop(investigation_id, None)
        logger.info("EventBus: subscriber removed for %s", investigation_id)

    async def publish(self, investigation_id: str, event: WSEvent) -> None:
        """Publish an event to every subscriber of *investigation_id*."""
        async with self._lock:
            queues = list(self._subscribers.get(investigation_id, []))
        for q in queues:
            try:
                q.put_nowait(event)
            except asyncio.QueueFull:
                logger.warning("EventBus: queue full, dropping event %s for %s",
                               event.event_type, investigation_id)

    async def emit(
        self,
        investigation_id: str,
        event_type: str,
        payload: dict[str, Any] | None = None,
    ) -> None:
        """Convenience wrapper: create a WSEvent and publish it."""
        event = WSEvent(investigation_id=investigation_id, event_type=event_type, payload=payload)
        await self.publish(investigation_id, event)

    async def get_events(self, investigation_id: str, queue: asyncio.Queue[WSEvent]) -> WSEvent:
        """Block until an event is available in *queue*, then return it."""
        return await queue.get()
