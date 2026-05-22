from datetime import datetime
from enum import Enum
from typing import Optional
import uuid

from sqlmodel import Field, SQLModel


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    REVIEWING = "reviewing"
    COMPLETED = "completed"
    FAILED = "failed"


class ContentMode(str, Enum):
    EDUCATIONAL = "educational"
    COMMERCIAL = "commercial"


class Job(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    status: JobStatus = Field(default=JobStatus.PENDING)
    mode: ContentMode
    input_type: str
    input_text: str
    reference_urls: Optional[str] = None
    current_step: Optional[str] = None
    error_message: Optional[str] = None
    final_video_url: Optional[str] = None
    review_required: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
