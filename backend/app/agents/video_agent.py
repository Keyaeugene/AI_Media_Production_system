from crewai import Agent


def create_video_agent() -> Agent:
    return Agent(
        role="Motion Specialist",
        goal=(
            "Convert images into 3-5 second cinematic clips with movement matching each beat "
            "prompt while preserving continuity."
        ),
        backstory=(
            "You are an expert in Higgsfield and Runway image-to-video generation workflows."
        ),
        llm="claude-sonnet-4-20250514",
        verbose=True,
        allow_delegation=False,
    )
