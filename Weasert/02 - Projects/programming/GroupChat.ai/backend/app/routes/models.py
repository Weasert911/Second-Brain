from fastapi import APIRouter, HTTPException, Depends
import httpx

from app.database import get_db
from app.auth import decrypt_key
from app.config import PROVIDER_DEFAULTS
from app.routes.auth import get_current_user

router = APIRouter()

async def fetch_models_openai_compatible(base_url: str, api_key: str = None):
    headers = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get(f"{base_url}/v1/models", headers=headers)
        if res.status_code != 200:
            return []
        data = res.json()
        return [{"id": m["id"], "name": m["id"], "context_window": m.get("context_length")} for m in data.get("data", [])]

async def fetch_models_ollama(base_url: str):
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get(f"{base_url}/api/tags")
        if res.status_code != 200:
            return []
        data = res.json()
        return [{"id": m["name"], "name": m["name"], "context_window": None} for m in data.get("models", [])]

async def fetch_models_google(api_key: str):
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}")
        if res.status_code != 200:
            return []
        data = res.json()
        return [{"id": m["name"].replace("models/", ""), "name": m.get("displayName", m["name"].replace("models/", "")),
                 "context_window": m.get("inputTokenLimit")} for m in data.get("models", [])]

@router.get("/{provider}")
async def list_models(provider: str, user_id: str = Depends(get_current_user)):
    meta = PROVIDER_DEFAULTS.get(provider)
    if not meta:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")

    # Get API key from database
    api_key = None
    endpoint = meta["base_url"]
    with get_db() as db:
        row = db.execute(
            "SELECT api_key_encrypted, endpoint FROM api_keys WHERE user_id = ? AND provider = ? AND is_active = 1",
            (user_id, provider)
        ).fetchone()
        if row:
            api_key = decrypt_key(row["api_key_encrypted"])
            if row["endpoint"]:
                endpoint = row["endpoint"]

    # Anthropic has no public model list
    if provider == "anthropic":
        return {"models": [], "note": "Anthropic does not provide a public model list endpoint"}

    if provider == "google" and api_key:
        models = await fetch_models_google(api_key)
    elif provider in ("ollama", "lmstudio"):
        models = await fetch_models_ollama(endpoint)
    else:
        models = await fetch_models_openai_compatible(endpoint, api_key)

    return {"models": models}
