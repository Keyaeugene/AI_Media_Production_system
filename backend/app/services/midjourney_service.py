import time
from typing import Any

import httpx

from app.config import settings


class MidjourneyService:
    def __init__(self) -> None:
        self.base_url = settings.MIDJOURNEY_API_URL.rstrip("/")
        self.headers = {"Authorization": f"Bearer {settings.MIDJOURNEY_API_KEY}"}

    def submit_prompt(self, prompt: str) -> str:
        with httpx.Client(timeout=60) as client:
            res = client.post(
                f"{self.base_url}/imagine",
                json={"prompt": prompt},
                headers=self.headers,
            )
            res.raise_for_status()
            return res.json()["id"]

    def poll_result(self, task_id: str, timeout_seconds: int = 300) -> dict[str, Any]:
        start = time.time()
        with httpx.Client(timeout=60) as client:
            while time.time() - start < timeout_seconds:
                res = client.get(f"{self.base_url}/tasks/{task_id}", headers=self.headers)
                res.raise_for_status()
                data = res.json()
                if data.get("status") in {"completed", "failed"}:
                    return data
                time.sleep(5)
        raise TimeoutError(f"Midjourney task timed out: {task_id}")

    def select_best_and_upscale(self, task_result: dict[str, Any]) -> str:
        # Provider-specific: assume best_url already returned for now.
        return task_result.get("best_url") or task_result.get("image_url", "")
