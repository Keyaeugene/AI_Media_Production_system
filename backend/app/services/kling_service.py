import time
from typing import Any

import httpx

from app.config import settings


class KlingService:
    def __init__(self) -> None:
        self.base_url = settings.KLING_API_URL.rstrip("/")
        self.headers = {"Authorization": f"Bearer {settings.KLING_API_KEY}"}

    def submit_image_to_video(self, image_url: str, prompt: str, duration: int = 4) -> str:
        with httpx.Client(timeout=60) as client:
            res = client.post(
                f"{self.base_url}/v1/videos",
                json={"image_url": image_url, "prompt": prompt, "duration": duration},
                headers=self.headers,
            )
            res.raise_for_status()
            return res.json()["id"]

    def poll_video(self, generation_id: str, timeout_seconds: int = 600) -> dict[str, Any]:
        start = time.time()
        with httpx.Client(timeout=60) as client:
            while time.time() - start < timeout_seconds:
                res = client.get(f"{self.base_url}/v1/videos/{generation_id}", headers=self.headers)
                res.raise_for_status()
                data = res.json()
                if data.get("status") in {"completed", "failed"}:
                    return data
                time.sleep(8)
        raise TimeoutError(f"Kling generation timed out: {generation_id}")
