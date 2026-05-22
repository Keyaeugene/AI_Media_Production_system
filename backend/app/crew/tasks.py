from crewai import Task

from app.agents.image_agent import create_image_agent
from app.agents.production_agent import create_production_agent
from app.agents.prompt_agent import create_prompt_agent
from app.agents.reviewer_agent import create_reviewer_agent
from app.agents.script_agent import create_script_agent
from app.agents.video_agent import create_video_agent


def build_tasks(job_input: dict) -> list[Task]:
    script_agent = create_script_agent()
    prompt_agent = create_prompt_agent()
    reviewer_agent = create_reviewer_agent()
    image_agent = create_image_agent()
    video_agent = create_video_agent()
    production_agent = create_production_agent()

    task_script = Task(
        description=f"""
Input type: {job_input["input_type"]}
Content mode: {job_input["mode"]}
Input: {job_input["input_text"]}

Generate a 60-90 second beat-based script with timestamp range, narration, visual note, and emotion.
""",
        expected_output="Numbered beats in plain text.",
        agent=script_agent,
    )

    task_prompts = Task(
        description=(
            "Generate one Midjourney prompt per beat including camera/lens/motion/lighting and "
            "ending with --ar 9:16 --v 7 --stylize 650 --q 2."
        ),
        expected_output="Numbered Midjourney prompts.",
        agent=prompt_agent,
        context=[task_script],
    )

    task_review = Task(
        description="Review prompts and output APPROVED or REVISION NEEDED with exact corrections.",
        expected_output="APPROVED or revision instructions.",
        agent=reviewer_agent,
        context=[task_script, task_prompts],
    )

    task_images = Task(
        description="Execute approved prompts and return JSON list with beat image URLs.",
        expected_output="JSON array of beat image results.",
        agent=image_agent,
        context=[task_review],
    )

    task_video = Task(
        description="Generate 3-5 second clips from beat images and return JSON clip list.",
        expected_output="JSON array of beat video clip results.",
        agent=video_agent,
        context=[task_prompts, task_images],
    )

    task_final = Task(
        description="Assemble final 9:16 video with voiceover and return final video metadata JSON.",
        expected_output="JSON object with final_video_url and metadata.",
        agent=production_agent,
        context=[task_script, task_video],
    )

    return [task_script, task_prompts, task_review, task_images, task_video, task_final]
