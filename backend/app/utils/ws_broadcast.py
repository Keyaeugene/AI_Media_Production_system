import asyncio
import json

from fastapi import WebSocket

# Shared with app.api.routes.websocket job log connections.
active_connections: dict[str, list[WebSocket]] = {}


async def _send_safe(ws: WebSocket, message: dict) -> None:
    try:
        await ws.send_text(json.dumps(message))
    except Exception:
        pass


def broadcast_log_non_blocking(job_id: str, message: dict) -> None:
    async def _broadcast() -> None:
        if job_id in active_connections:
            await asyncio.gather(
                *[_send_safe(ws, message) for ws in list(active_connections[job_id])],
                return_exceptions=True,
            )

    try:
        loop = asyncio.get_running_loop()
        loop.create_task(_broadcast())
    except RuntimeError:
        # No running loop in this thread/celery worker context.
        pass
