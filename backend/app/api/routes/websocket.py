"""WebSocket endpoint for real-time investigation event streaming."""

from __future__ import annotations

import asyncio
import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.deps import get_event_bus

router = APIRouter()
logger = logging.getLogger(__name__)

PING_INTERVAL_SECONDS = 30


@router.websocket("/ws/investigation/{investigation_id}")
async def investigation_ws(websocket: WebSocket, investigation_id: str) -> None:
    """Stream investigation events over WebSocket with ping/pong keepalive.

    Protocol
    --------
    - Server sends JSON events as they arrive on the event bus.
    - Server sends ``{"type": "ping"}`` every 30 s; client should reply with
      ``{"type": "pong"}`` (though it is not enforced).
    - Client may send ``{"type": "ping"}``; server replies ``{"type": "pong"}``.
    - Connection closes cleanly on ``WebSocketDisconnect`` or any error.
    """
    await websocket.accept()
    event_bus = get_event_bus()
    queue = await event_bus.subscribe(investigation_id)
    logger.info("WS connected: investigation=%s", investigation_id)

    async def _send_events() -> None:
        """Forward events from the bus queue to the WS client."""
        try:
            while True:
                event = await event_bus.get_events(investigation_id, queue)
                await websocket.send_text(event.to_json())
        except asyncio.CancelledError:
            return

    async def _keepalive() -> None:
        """Periodically send ping frames to keep the connection alive."""
        try:
            while True:
                await asyncio.sleep(PING_INTERVAL_SECONDS)
                await websocket.send_text(json.dumps({"type": "ping"}))
        except asyncio.CancelledError:
            return

    async def _receive_messages() -> None:
        """Listen for client messages (pong replies or close)."""
        try:
            while True:
                raw = await websocket.receive_text()
                try:
                    msg = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                if msg.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
        except (WebSocketDisconnect, asyncio.CancelledError):
            return

    send_task = asyncio.create_task(_send_events())
    ping_task = asyncio.create_task(_keepalive())
    recv_task = asyncio.create_task(_receive_messages())

    try:
        # Wait until any task completes (usually recv on disconnect)
        done, pending = await asyncio.wait(
            [send_task, ping_task, recv_task],
            return_when=asyncio.FIRST_COMPLETED,
        )
        for task in pending:
            task.cancel()
        # Await cancelled tasks so CancelledError is suppressed
        await asyncio.gather(*pending, return_exceptions=True)
    except WebSocketDisconnect:
        pass
    finally:
        await event_bus.unsubscribe(investigation_id, queue)
        logger.info("WS disconnected: investigation=%s", investigation_id)
