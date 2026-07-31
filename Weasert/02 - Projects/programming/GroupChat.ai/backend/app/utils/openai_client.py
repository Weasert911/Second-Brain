import logging

import httpx

from ..config import settings

logger = logging.getLogger(__name__)


class AIServiceError(Exception):
    pass


async def get_ai_response(model: str, temperature: float, messages: list[dict]) -> str:
    if not settings.GROQ_API_KEY:
        raise AIServiceError("GROQ_API_KEY is not configured")

    url = f"{settings.GROQ_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "temperature": temperature,
        "messages": messages,
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except httpx.TimeoutException:
        logger.error("Groq API request timed out")
        raise AIServiceError("AI service timed out")
    except httpx.HTTPStatusError as e:
        logger.error("Groq API error: %s - %s", e.response.status_code, e.response.text)
        raise AIServiceError(f"AI service error: {e.response.status_code}")
    except Exception as e:
        logger.exception("Unexpected error calling Groq API")
        raise AIServiceError(str(e))
