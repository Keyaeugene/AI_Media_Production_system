from datetime import datetime
from enum import Enum
from typing import Optional
import uuid

from sqlmodel import Field, SQLModel


class AssetType(str, Enum):
    SCRIPT = "script"
    PROMPT = "prompt"
    IMAGE = "image"
    VIDEO_CLIP = "video_clip"
    VOICEOVER = "voiceover"
    FINAL_VIDEO = "final_video"


class Asset(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    job_id: str = Field(foreign_key="job.id", index=True)
    asset_type: AssetType
    beat_index: Optional[int] = None
    storage_url: str
    local_path: Optional[str] = None
    meta_json: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
