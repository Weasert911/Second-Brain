import httpx
import json
from typing import AsyncGenerator

async def stream_openai_compatible(
    base_url: str, api_key: str, model: str,
    system: str, messages: list, temperature: float = 0.7
) -> AsyncGenerator[str, None]:
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "messages": [{"role": "system", "content": system}] + messages,
        "stream": True,
        "temperature": temperature,
    }
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream("POST", f"{base_url}/v1/chat/completions",
                                 headers=headers, json=payload) as resp:
            if resp.status_code != 200:
                body = await resp.aread()
                raise Exception(f"API error {resp.status_code}: {body.decode()}")
            async for line in resp.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:]
                if data.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(data)
                    delta = chunk["choices"][0].get("delta", {})
                    if "content" in delta:
                        yield delta["content"]
                except (json.JSONDecodeError, KeyError, IndexError):
                    continue

async def stream_anthropic(
    base_url: str, api_key: str, model: str,
    system: str, messages: list, temperature: float = 0.7
) -> AsyncGenerator[str, None]:
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "max_tokens": 8192,
        "system": system,
        "messages": messages,
        "stream": True,
        "temperature": temperature,
    }
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream("POST", f"{base_url}/v1/messages",
                                 headers=headers, json=payload) as resp:
            if resp.status_code != 200:
                body = await resp.aread()
                raise Exception(f"API error {resp.status_code}: {body.decode()}")
            async for line in resp.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:]
                try:
                    event = json.loads(data)
                    if event.get("type") == "content_block_delta":
                        yield event.get("delta", {}).get("text", "")
                except json.JSONDecodeError:
                    continue

async def stream_google(
    base_url: str, api_key: str, model: str,
    system: str, messages: list, temperature: float = 0.7
) -> AsyncGenerator[str, None]:
    url = f"{base_url}/v1beta/models/{model}:streamGenerateContent?alt=sse&key={api_key}"
    contents = []
    for m in messages:
        contents.append({"role": "user" if m["role"] == "user" else "model", "parts": [{"text": m["content"]}]})
    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": system}]},
        "generationConfig": {"temperature": temperature},
    }
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream("POST", url, json=payload) as resp:
            if resp.status_code != 200:
                body = await resp.aread()
                raise Exception(f"API error {resp.status_code}: {body.decode()}")
            async for line in resp.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:]
                try:
                    event = json.loads(data)
                    candidates = event.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        for p in parts:
                            if "text" in p:
                                yield p["text"]
                except json.JSONDecodeError:
                    continue

async def stream_chat(
    provider: str, base_url: str, api_key: str, model: str,
    system: str, messages: list, temperature: float = 0.7
) -> AsyncGenerator[str, None]:
    if provider == "anthropic":
        async for chunk in stream_anthropic(base_url, api_key, model, system, messages, temperature):
            yield chunk
    elif provider == "google":
        async for chunk in stream_google(base_url, api_key, model, system, messages, temperature):
            yield chunk
    else:
        async for chunk in stream_openai_compatible(base_url, api_key, model, system, messages, temperature):
            yield chunk

async def chat(
    provider: str, base_url: str, api_key: str, model: str,
    system: str, messages: list, temperature: float = 0.7
) -> str:
    result = ""
    async for chunk in stream_chat(provider, base_url, api_key, model, system, messages, temperature):
        result += chunk
    return result
