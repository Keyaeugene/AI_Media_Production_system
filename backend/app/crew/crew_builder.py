import json
import tempfile
from datetime import datetime

from crewai import Crew, Process

from app.utils.ws_broadcast import broadcast_log_non_blocking
from app.crew.tasks import build_tasks
from app.database import get_session_sync
from app.models.asset import Asset, AssetType
from app.models.job import Job, JobStatus
from app.models.log import LogEntry
from app.services.claude_service import complete
from app.services.elevenlabs_service import generate_voiceover
from app.services.ffmpeg_service import apply_color_grade, assemble_video
from app.services.higgsfield_service import HiggsfieldService
from app.services.midjourney_service import MidjourneyService
from app.services.storage_service import StorageService
from app.utils.prompts import (
    PROMPT_SYSTEM,
    REVIEWER_SYSTEM,
    SCRIPT_SYSTEM_COMMERCIAL,
    SCRIPT_SYSTEM_EDUCATIONAL,
)

MAX_REVISION_ROUNDS = 3


def _set_job_progress(
    job_id: str,
    *,
    current_step: str | None = None,
    status: JobStatus | None = None,
) -> None:
    with get_session_sync() as session:
        job = session.get(Job, job_id)
        if not job:
            return
        if current_step is not None:
            job.current_step = current_step
        if status is not None:
            job.status = status
        job.updated_at = datetime.utcnow()
        session.add(job)
        session.commit()


def log_to_db_and_ws(job_id: str, agent_name: str, message: str, level: str = "info") -> None:
    with get_session_sync() as session:
        session.add(
            LogEntry(job_id=job_id, agent_name=agent_name, message=message, level=level)
        )
        session.commit()
    broadcast_log_non_blocking(
        job_id,
        {
            "agent": agent_name,
            "message": message,
            "level": level,
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


def _script_prompt(mode: str) -> str:
    return SCRIPT_SYSTEM_COMMERCIAL if mode == "commercial" else SCRIPT_SYSTEM_EDUCATIONAL


def _generate_script(job_input: dict) -> str:
    return complete(
        _script_prompt(job_input["mode"]),
        f"Input type: {job_input['input_type']}\nInput:\n{job_input['input_text']}",
    )


def _generate_prompts(script: str, mode: str) -> str:
    return complete(PROMPT_SYSTEM, f"Mode: {mode}\nScript:\n{script}")


def _revise_prompts(script: str, prompts: str, review_feedback: str) -> str:
    return complete(
        PROMPT_SYSTEM,
        f"Script:\n{script}\n\nCurrent prompts:\n{prompts}\n\nRevise based on:\n{review_feedback}",
    )


def run_with_revision_loop(job_id: str, job_input: dict) -> dict:
    _set_job_progress(job_id, current_step="script")
    script = _generate_script(job_input)
    _set_job_progress(job_id, current_step="prompts")
    prompts = _generate_prompts(script, job_input["mode"])
    approved = False

    for round_num in range(MAX_REVISION_ROUNDS):
        _set_job_progress(job_id, current_step="review", status=JobStatus.REVIEWING)
        review = complete(REVIEWER_SYSTEM, f"Script:\n{script}\n\nPrompts:\n{prompts}")
        if "APPROVED" in review:
            approved = True
            log_to_db_and_ws(job_id, "Reviewer", f"Round {round_num + 1} approved.")
            break
        log_to_db_and_ws(
            job_id,
            "Reviewer",
            f"Round {round_num + 1} revisions needed. Regenerating prompts.",
            "warn",
        )
        prompts = _revise_prompts(script, prompts, review)

    _set_job_progress(job_id, status=JobStatus.RUNNING)
    return {"script": script, "prompts": prompts, "approved": approved}


def _extract_numbered_lines(text: str) -> list[str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return [line for line in lines if line[0].isdigit()]


def execute_pipeline(job_id: str, job_input: dict) -> dict:
    # Build Crew object to preserve architecture contract.
    tasks = build_tasks(job_input)
    Crew(
        agents=[task.agent for task in tasks],
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )

    log_to_db_and_ws(job_id, "System", "Starting script and prompt generation.")
    content = run_with_revision_loop(job_id, job_input)
    script = content["script"]
    prompts = content["prompts"]
    _set_job_progress(job_id, current_step="images")

    with get_session_sync() as session:
        job = session.get(Job, job_id)
        if job:
            job.review_required = not content["approved"]
            session.add(job)
            session.commit()

    storage = StorageService()
    midjourney = MidjourneyService()
    higgsfield = HiggsfieldService()

    prompt_lines = _extract_numbered_lines(prompts)
    image_urls: list[str] = []
    clip_paths: list[str] = []

    for index, prompt in enumerate(prompt_lines, start=1):
        _set_job_progress(job_id, current_step="images")
        log_to_db_and_ws(job_id, "ImageAgent", f"Generating beat {index} image.")
        task_id = midjourney.submit_prompt(prompt)
        result = midjourney.poll_result(task_id)
        image_url = midjourney.select_best_and_upscale(result)
        image_urls.append(image_url)
        with get_session_sync() as session:
            session.add(
                Asset(
                    job_id=job_id,
                    asset_type=AssetType.IMAGE,
                    beat_index=index,
                    storage_url=image_url,
                )
            )
            session.commit()

        _set_job_progress(job_id, current_step="clips")
        log_to_db_and_ws(job_id, "VideoAgent", f"Generating beat {index} clip in Higgsfield.")
        generation_id = higgsfield.submit_image_to_video(image_url=image_url, prompt=prompt, duration=4)
        video_result = higgsfield.poll_video(generation_id)
        clip_url = video_result.get("video_url", "")
        with get_session_sync() as session:
            session.add(
                Asset(
                    job_id=job_id,
                    asset_type=AssetType.VIDEO_CLIP,
                    beat_index=index,
                    storage_url=clip_url,
                )
            )
            session.commit()
        clip_paths.append(clip_url)

    with tempfile.TemporaryDirectory() as temp_dir:
        voice_path = f"{temp_dir}/voiceover.mp3"
        final_path = f"{temp_dir}/final.mp4"
        graded_path = f"{temp_dir}/final_graded.mp4"

        _set_job_progress(job_id, current_step="finalize")
        log_to_db_and_ws(job_id, "ProductionAgent", "Generating voiceover.")
        generate_voiceover(script, voice_path)

        # For remote clip URLs, production deployment should pre-download clips locally.
        # Placeholder assumes local or mounted clip paths for assembly stage.
        local_or_remote = [path for path in clip_paths if path]
        assemble_video(local_or_remote, voice_path, final_path)
        apply_color_grade(final_path, graded_path, job_input["mode"])

        final_video_url = storage.upload_file(graded_path, key=f"jobs/{job_id}/final_video.mp4")
        with get_session_sync() as session:
            session.add(
                Asset(
                    job_id=job_id,
                    asset_type=AssetType.FINAL_VIDEO,
                    storage_url=final_video_url,
                    meta_json=json.dumps({"source": "ffmpeg"}),
                )
            )
            session.commit()

    return {"final_video_url": final_video_url}
