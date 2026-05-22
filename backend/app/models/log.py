from datetime import datetime
import uuid

from sqlmodel import Field, SQLModel


class LogEntry(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    job_id: str = Field(foreign_key="job.id", index=True)
    agent_name: str
    message: str
    level: str = "info"
    created_at: datetime = Field(default_factory=datetime.utcnow)
