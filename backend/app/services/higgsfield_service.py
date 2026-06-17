import time
from typing import Any

import httpx

from app.config import settings


class HiggsfieldService:
    def __init__(self) -> None:
        self.base_url = settings.HIGGSFIELD_API_URL.rstrip("/")
        self.headers = {"Authorization": f"Bearer {settings.HIGGSFIELD_API_KEY}"}

    def submit_image_to_video(self, image_url: str, prompt: str, duration: int = 4) -> str:
        with httpx.Client(timeout=60) as client:
            res = client.post(
                f"{self.base_url}/v1/image2video/dop",
                json={
                    "model": "dop-turbo",
                    "prompt": prompt,
                    "duration": duration,
                    "input_images": [{"type": "image_url", "image_url": image_url}],
                },
                headers=self.headers,
            )
            res.raise_for_status()
            data = res.json()
            if "id" in data:
                return data["id"]
            jobs = data.get("jobs") or []
            if jobs:
                return jobs[0]["id"]
            return data["generation_id"]

    def poll_video(self, generation_id: str, timeout_seconds: int = 600) -> dict[str, Any]:
        start = time.time()
        with httpx.Client(timeout=60) as client:
            while time.time() - start < timeout_seconds:
                res = client.get(
                    f"{self.base_url}/v1/generations/{generation_id}",
                    headers=self.headers,
                )
                res.raise_for_status()
                data = res.json()
                status = data.get("status")
                if status in {"completed", "failed"}:
                    if status == "completed" and "video_url" not in data:
                        jobs = data.get("jobs") or []
                        if jobs:
                            results = jobs[0].get("results") or {}
                            raw = results.get("raw") or {}
                            if raw.get("url"):
                                data["video_url"] = raw["url"]
                        output = data.get("output") or {}
                        if output.get("url"):
                            data["video_url"] = output["url"]
                    return data
                time.sleep(8)
        raise TimeoutError(f"Higgsfield generation timed out: {generation_id}")
