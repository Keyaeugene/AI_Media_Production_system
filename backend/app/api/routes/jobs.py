import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.database import get_session
from app.models.job import ContentMode, Job
from app.models.log import LogEntry
from app.worker.tasks import run_pipeline

router = APIRouter()


class JobCreate(BaseModel):
    mode: ContentMode
    input_type: str
    input_text: str
    reference_urls: Optional[List[str]] = None


class JobResponse(BaseModel):
    id: str
    status: str
    mode: str
    current_step: Optional[str]
    final_video_url: Optional[str]
    error_message: Optional[str]
    created_at: str


class LogLine(BaseModel):
    agent: str
    message: str
    level: str
    timestamp: str


def _job_to_response(job: Job) -> JobResponse:
    return JobResponse(
        id=job.id,
        status=job.status.value if hasattr(job.status, "value") else str(job.status),
        mode=job.mode.value if hasattr(job.mode, "value") else str(job.mode),
        current_step=job.current_step,
        final_video_url=job.final_video_url,
        error_message=job.error_message,
        created_at=job.created_at.isoformat(),
    )


@router.post("/", response_model=JobResponse)
def create_job(payload: JobCreate, session: Session = Depends(get_session)) -> JobResponse:
    job = Job(
        mode=payload.mode,
        input_type=payload.input_type,
        input_text=payload.input_text,
        reference_urls=json.dumps(payload.reference_urls) if payload.reference_urls else None,
    )
    session.add(job)
    session.commit()
    session.refresh(job)
    run_pipeline.delay(job.id)
    return _job_to_response(job)


@router.get("/", response_model=list[JobResponse])
def list_jobs(session: Session = Depends(get_session)) -> list[JobResponse]:
    jobs = session.exec(select(Job).order_by(Job.created_at.desc())).all()
    return [_job_to_response(j) for j in jobs]


@router.get("/{job_id}/logs", response_model=list[LogLine])
def list_job_logs(job_id: str, session: Session = Depends(get_session)) -> list[LogLine]:
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    rows = session.exec(
        select(LogEntry).where(LogEntry.job_id == job_id).order_by(LogEntry.created_at)
    ).all()
    return [
        LogLine(
            agent=e.agent_name,
            message=e.message,
            level=e.level,
            timestamp=e.created_at.isoformat(),
        )
        for e in rows
    ]


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, session: Session = Depends(get_session)) -> JobResponse:
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return _job_to_response(job)
