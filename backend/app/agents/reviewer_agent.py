from crewai import Agent


def create_reviewer_agent() -> Agent:
    return Agent(
        role="Quality Assurance & Alignment Checker",
        goal=(
            "Score prompts 1-10 on alignment, specificity, cinematic quality, and narrative "
            "progression. Approve only when score >= 9."
        ),
        backstory=(
            "You are a strict film editor who rejects vague visuals and requires precision."
        ),
        llm="claude-sonnet-4-20250514",
        verbose=True,
        allow_delegation=False,
    )
