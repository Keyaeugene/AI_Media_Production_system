import httpx

from app.config import settings

BASE_URL = "https://api.elevenlabs.io/v1"


def generate_voiceover(script_text: str, output_path: str) -> str:
    headers = {
        "xi-api-key": settings.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": script_text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.75,
            "similarity_boost": 0.80,
            "style": 0.10,
            "use_speaker_boost": True,
        },
    }
    with httpx.Client(timeout=120) as client:
        response = client.post(
            f"{BASE_URL}/text-to-speech/{settings.ELEVENLABS_VOICE_ID}",
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
    with open(output_path, "wb") as file:
        file.write(response.content)
    return output_path
