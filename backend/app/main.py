from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import assets, jobs, websocket
from app.database import create_db_and_tables
from app.config import settings

log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    log.info("Database tables created")
    yield


app = FastAPI(title="AI Media Production System", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(assets.router, prefix="/api/assets", tags=["assets"])
app.include_router(websocket.router, tags=["websocket"])
