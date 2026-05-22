import asyncio

import json



from fastapi import APIRouter, WebSocket, WebSocketDisconnect



from app.utils.ws_broadcast import active_connections



router = APIRouter()





@router.websocket("/ws/{job_id}")

async def job_logs_ws(websocket: WebSocket, job_id: str):

    await websocket.accept()

    active_connections.setdefault(job_id, []).append(websocket)

    try:

        while True:

            await asyncio.sleep(30)

            await websocket.send_text(json.dumps({"type": "ping"}))

    except WebSocketDisconnect:

        pass

    finally:

        if job_id in active_connections and websocket in active_connections[job_id]:

            active_connections[job_id].remove(websocket)

