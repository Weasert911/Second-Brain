from typing import Optional

from app.auth import decrypt_key, encrypt_key
from app.database import get_db
from app.routes.auth import get_current_user
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

router = APIRouter()


class SaveKeyRequest(BaseModel):
    provider: str
    api_key: str
    endpoint: Optional[str] = None
    model: Optional[str] = None


@router.get("")
async def list_providers(user_id: str = Depends(get_current_user)):
    with get_db() as db:
        keys = db.execute(
            "SELECT id, provider, endpoint, model, is_active, created_at FROM api_keys WHERE user_id = ?",
            (user_id,),
        ).fetchall()
        return [
            {
                "id": k["id"],
                "provider": k["provider"],
                "endpoint": k["endpoint"],
                "model": k["model"],
                "is_active": k["is_active"],
            }
            for k in keys
        ]


@router.post("")
async def save_provider_key(
    req: SaveKeyRequest, user_id: str = Depends(get_current_user)
):
    encrypted = encrypt_key(req.api_key)
    with get_db() as db:
        existing = db.execute(
            "SELECT id FROM api_keys WHERE user_id = ? AND provider = ?",
            (user_id, req.provider),
        ).fetchone()

        if existing:
            db.execute(
                "UPDATE api_keys SET api_key_encrypted = ?, endpoint = ?, model = ? WHERE id = ?",
                (encrypted, req.endpoint, req.model, existing["id"]),
            )
        else:
            db.execute(
                "INSERT INTO api_keys (user_id, provider, api_key_encrypted, endpoint, model) VALUES (?, ?, ?, ?, ?)",
                (user_id, req.provider, encrypted, req.endpoint, req.model),
            )
        db.commit()
    return {"status": "saved"}


@router.delete("/{provider}")
async def delete_provider_key(provider: str, user_id: str = Depends(get_current_user)):
    with get_db() as db:
        db.execute(
            "DELETE FROM api_keys WHERE user_id = ? AND provider = ?",
            (user_id, provider),
        )
        db.commit()
    return {"status": "deleted"}


@router.get("/{provider}/key")
async def get_provider_key(provider: str, user_id: str = Depends(get_current_user)):
    """Get decrypted API key for a provider. Internal use only."""
    with get_db() as db:
        row = db.execute(
            "SELECT api_key_encrypted FROM api_keys WHERE user_id = ? AND provider = ? AND is_active = 1",
            (user_id, provider),
        ).fetchone()
        if not row:
            raise HTTPException(
                status_code=404, detail="No API key configured for this provider"
            )
        return {"api_key": decrypt_key(row["api_key_encrypted"])}
