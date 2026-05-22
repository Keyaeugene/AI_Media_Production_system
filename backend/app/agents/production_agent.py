from crewai import Agent


def create_production_agent() -> Agent:
    return Agent(
        role="Editor & Polisher",
        goal=(
            "Assemble beat clips, sync ElevenLabs voiceover, apply subtle grade, and export a "
            "final 9:16 vertical video optimized for short-form platforms."
        ),
        backstory=(
            "You are a meticulous short-form editor focused on clarity, pacing, and polish."
        ),
        llm="claude-sonnet-4-20250514",
        verbose=True,
        allow_delegation=False,
    )
