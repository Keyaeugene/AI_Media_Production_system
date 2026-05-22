from crewai import Agent


def create_prompt_agent() -> Agent:
    return Agent(
        role="Cinematic Prompt Specialist",
        goal=(
            "Generate ultra-detailed Midjourney prompts for each script beat with cinematic "
            "camera/lens/motion/lighting detail and 9:16 vertical framing."
        ),
        backstory=(
            "You craft emotionally distinct, non-generic prompts with ARRI Alexa Mini LF "
            "language and clear narrative intent per beat."
        ),
        llm="claude-sonnet-4-20250514",
        verbose=True,
        allow_delegation=False,
    )
