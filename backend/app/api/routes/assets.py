from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models.asset import Asset

router = APIRouter()


@router.get("/{job_id}")
def get_assets(job_id: str, session: Session = Depends(get_session)) -> list[Asset]:
    return session.exec(
        select(Asset).where(Asset.job_id == job_id).order_by(Asset.created_at)
    ).all()
