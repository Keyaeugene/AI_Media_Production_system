import anthropic

from app.config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def complete(system_prompt: str, user_message: str, max_tokens: int = 4096) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    return message.content[0].text
