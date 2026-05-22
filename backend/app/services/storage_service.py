import os
from pathlib import Path
from typing import BinaryIO
import uuid

import boto3

from app.config import settings


class StorageService:
    def __init__(self) -> None:
        self.provider = settings.STORAGE_PROVIDER.lower()
        self.bucket = settings.AWS_BUCKET_NAME
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

    def upload_file(self, file_path: str, key: str | None = None) -> str:
        if not key:
            key = f"assets/{uuid.uuid4()}_{Path(file_path).name}"
        self.s3.upload_file(file_path, self.bucket, key)
        return f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

    def upload_bytes(self, content: bytes, key: str) -> str:
        self.s3.upload_fileobj(BinaryReader(content), self.bucket, key)
        return f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

    def download_file(self, key: str, target_path: str) -> str:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        self.s3.download_file(self.bucket, key, target_path)
        return target_path


class BinaryReader(BinaryIO):
    def __init__(self, payload: bytes) -> None:
        self.payload = payload
        self.index = 0

    def read(self, n: int = -1) -> bytes:  # type: ignore[override]
        if n == -1:
            n = len(self.payload) - self.index
        chunk = self.payload[self.index : self.index + n]
        self.index += len(chunk)
        return chunk

    def readable(self) -> bool:
        return True
