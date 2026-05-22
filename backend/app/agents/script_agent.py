from crewai import Agent


def create_script_agent() -> Agent:
    return Agent(
        role="Content Strategist & Script Writer",
        goal=(
            "From a theme or brief, generate or refine a compelling script with clear timed "
            "beats, visual notes, timestamps, and one driving emotion per beat."
        ),
        backstory=(
            "You write story-driven short-form scripts. For educational mode, keep calm and "
            "authoritative. For commercial mode, keep product-accurate and benefit-driven."
        ),
        llm="claude-sonnet-4-20250514",
        verbose=True,
        allow_delegation=False,
    )
