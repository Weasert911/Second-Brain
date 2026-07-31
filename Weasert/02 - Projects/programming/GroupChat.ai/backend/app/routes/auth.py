from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
import uuid

from app.database import get_db
from app.auth import hash_password, verify_password, generate_session_token

router = APIRouter()

# Simple session store (in production use Redis)
sessions = {}

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user_id = sessions.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    return user_id

@router.post("/register")
async def register(req: RegisterRequest):
    with get_db() as db:
        existing = db.execute("SELECT id FROM users WHERE username = ?", (req.username,)).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")

        user_id = str(uuid.uuid4())
        password_hash = hash_password(req.password)
        db.execute("INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)",
                   (user_id, req.username, password_hash))
        db.commit()

        token = generate_session_token()
        sessions[token] = user_id

        return {"token": token, "user_id": user_id, "username": req.username}

@router.post("/login")
async def login(req: LoginRequest):
    with get_db() as db:
        user = db.execute("SELECT id, password_hash FROM users WHERE username = ?",
                          (req.username,)).fetchone()
        if not user or not verify_password(req.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = generate_session_token()
        sessions[token] = user["id"]

        return {"token": token, "user_id": user["id"], "username": req.username}

@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user)):
    with get_db() as db:
        user = db.execute("SELECT id, username, created_at FROM users WHERE id = ?",
                          (user_id,)).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"user_id": user["id"], "username": user["username"]}
