from datetime import datetime

import structlog

from app.crew.crew_builder import execute_pipeline
from app.database import get_session_sync
from app.models.job import Job, JobStatus
from app.worker.celery_app import celery_app

log = structlog.get_logger()


@celery_app.task(bind=True, max_retries=2)
def run_pipeline(self, job_id: str):
    with get_session_sync() as session:
        job = session.get(Job, job_id)
        if not job:
            return {"status": "missing"}
        if job.status == JobStatus.COMPLETED:
            return {"status": "already_completed"}
        if job.status == JobStatus.RUNNING:
            return {"status": "already_running"}
        job.status = JobStatus.RUNNING
        job.updated_at = datetime.utcnow()
        session.add(job)
        session.commit()
        job_input = {
            "mode": job.mode.value if hasattr(job.mode, "value") else str(job.mode),
            "input_type": job.input_type,
            "input_text": job.input_text,
        }

    try:
        result = execute_pipeline(job_id=job_id, job_input=job_input)
        with get_session_sync() as session:
            job = session.get(Job, job_id)
            if not job:
                return {"status": "missing_after_run"}
            job.status = JobStatus.COMPLETED
            job.final_video_url = result.get("final_video_url")
            job.current_step = "completed"
            job.updated_at = datetime.utcnow()
            session.add(job)
            session.commit()
        return result
    except Exception as exc:
        log.error("Pipeline failed", job_id=job_id, error=str(exc))
        with get_session_sync() as session:
            job = session.get(Job, job_id)
            if job:
                job.status = JobStatus.FAILED
                job.error_message = str(exc)
                job.updated_at = datetime.utcnow()
                session.add(job)
                session.commit()
        raise self.retry(exc=exc, countdown=60)
