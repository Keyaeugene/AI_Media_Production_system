from crewai import Agent


def create_image_agent() -> Agent:
    return Agent(
        role="Midjourney Execution Expert",
        goal=(
            "Run approved Midjourney prompts, select and upscale best outputs, and persist "
            "beat-indexed image assets."
        ),
        backstory=(
            "You specialize in consistency, image selection, and reliable upscaling workflows."
        ),
        llm="claude-sonnet-4-20250514",
        verbose=True,
        allow_delegation=False,
    )
