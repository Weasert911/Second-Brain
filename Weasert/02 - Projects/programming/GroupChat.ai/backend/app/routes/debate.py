from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import json
import asyncio
import uuid
import time
import random

from app.database import get_db
from app.auth import decrypt_key
from app.config import PROVIDER_DEFAULTS
from app.providers.layer import stream_chat
from app.routes.auth import get_current_user

router = APIRouter()

class AgentConfig(BaseModel):
    id: str
    name: str
    personality: str
    color: str
    model: Optional[str] = None
    provider: Optional[str] = None

class StartDebateRequest(BaseModel):
    topic: str
    mode: str = "Discussion"
    agents: List[AgentConfig]
    speed_ms: int = 800
    max_turns: int = 6

class ContinueDebateRequest(BaseModel):
    debate_id: str
    user_message: str

def get_provider_config(user_id: str, provider: str):
    with get_db() as db:
        row = db.execute(
            "SELECT api_key_encrypted, endpoint FROM api_keys WHERE user_id = ? AND provider = ? AND is_active = 1",
            (user_id, provider)
        ).fetchone()
        meta = PROVIDER_DEFAULTS.get(provider, {})
        if not row:
            raise HTTPException(status_code=400, detail=f"No API key configured for {provider}")
        return {
            "api_key": decrypt_key(row["api_key_encrypted"]),
            "base_url": row["endpoint"] or meta.get("base_url", ""),
        }

def build_system_prompt(agent, topic, mode, other_agents, history):
    names = [a.name for a in other_agents]
    agent_list = ", ".join(names) if names else "just you"
    turns_desc = ""
    if mode == "Structured Debate":
        turns_desc = "\nThis is a structured debate. Make your strongest argument."
    elif mode == "Brainstorm":
        turns_desc = "\nThis is a brainstorming session. Be creative and build on ideas."
    elif mode == "Devil's Advocate":
        turns_desc = "\nYou must argue against the majority position."
    elif mode == "Expert Panel":
        turns_desc = "\nRespond as a domain expert with authoritative knowledge."
    return (
        f"You are {agent.name}, a debater with the following personality: {agent.personality}\n"
        f"You are discussing: {topic}\n"
        f"Other participants: {agent_list}\n"
        f"Debate mode: {mode}{turns_desc}\n\n"
        f"Rules:\n"
        f"- Keep responses under 3 sentences unless the point really warrants more\n"
        f"- Never repeat a point already made\n"
        f"- Engage with what others said, don't just monologue\n"
        f"- Be direct and opinionated\n"
        f"- Do NOT use **, *, #, ##, or any markdown formatting\n"
        f"- Write in plain conversational text only\n"
        + (f"\nConversation so far:\n{history}" if history else "")
    )

@router.post("/stream")
async def start_debate_stream(req: StartDebateRequest, user_id: str = Depends(get_current_user)):
    debate_id = str(uuid.uuid4())

    with get_db() as db:
        db.execute(
            "INSERT INTO debates (id, user_id, title, mode, topic) VALUES (?, ?, ?, ?, ?)",
            (debate_id, user_id, req.topic, req.mode, req.topic)
        )
        for agent in req.agents:
            db.execute(
                "INSERT INTO messages (debate_id, agent_id, sender, color, content) VALUES (?, ?, ?, ?, ?)",
                (debate_id, agent.id, f"system:{agent.name}", agent.color, f"{agent.name} has joined the debate")
            )
        db.commit()

    async def debate_generator():
        agents = req.agents
        topic = req.topic
        mode = req.mode
        history_lines = []
        current_speaker_idx = 0

        # Yield debate_id first
        yield json.dumps({"type": "debate_id", "debate_id": debate_id}) + "\n"

        # Save initial messages
        with get_db() as db:
            for agent in agents:
                db.execute(
                    "INSERT INTO messages (debate_id, agent_id, sender, color, content, model_used) VALUES (?, ?, ?, ?, ?, ?)",
                    (debate_id, agent.id, f"system:{agent.name}", agent.color, f"{agent.name} has joined the debate", None)
                )
            db.commit()

        for turn in range(req.max_turns):
            agent = agents[current_speaker_idx]
            provider = agent.provider or "anthropic"
            model = agent.model or PROVIDER_DEFAULTS.get(provider, {}).get("default_model", "")

            if not model:
                yield json.dumps({"type": "error", "message": f"No model configured for {agent.name}"}) + "\n"
                break

            config = get_provider_config(user_id, provider)
            history = "\n".join(history_lines[-20:]) if history_lines else ""
            system = build_system_prompt(agent, topic, mode, [a for a in agents if a.id != agent.id], history)

            yield json.dumps({
                "type": "agent_start",
                "agent_id": agent.id,
                "agent_name": agent.name,
                "color": agent.color,
            }) + "\n"

            full_response = ""
            messages_for_api = [{"role": "user", "content": f"Continue the discussion about: {topic}"}]

            try:
                async for chunk in stream_chat(
                    provider=provider,
                    base_url=config["base_url"],
                    api_key=config["api_key"],
                    model=model,
                    system=system,
                    messages=messages_for_api,
                ):
                    full_response += chunk
                    yield json.dumps({
                        "type": "chunk",
                        "agent_id": agent.id,
                        "content": chunk,
                    }) + "\n"
            except Exception as e:
                yield json.dumps({"type": "error", "message": str(e)}) + "\n"
                break

            # Clean response
            clean = full_response.replace("**", "").replace("*", "").strip()
            history_lines.append(f"{agent.name}: {clean}")

            # Save to database
            with get_db() as db:
                db.execute(
                    "INSERT INTO messages (debate_id, agent_id, sender, color, content, tokens_used, model_used) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (debate_id, agent.id, agent.name, agent.color, clean, 0, model)
                )
                db.commit()

            yield json.dumps({
                "type": "agent_done",
                "agent_id": agent.id,
                "full_response": clean,
            }) + "\n"

            current_speaker_idx = (current_speaker_idx + 1) % len(agents)
            await asyncio.sleep(req.speed_ms / 1000)

        yield json.dumps({"type": "debate_done", "debate_id": debate_id}) + "\n"

    return StreamingResponse(debate_generator(), media_type="text/event-stream")

@router.post("/continue")
async def continue_debate(req: ContinueDebateRequest, user_id: str = Depends(get_current_user)):
    with get_db() as db:
        debate = db.execute("SELECT * FROM debates WHERE id = ? AND user_id = ?",
                            (req.debate_id, user_id)).fetchone()
        if not debate:
            raise HTTPException(status_code=404, detail="Debate not found")
        messages = db.execute(
            "SELECT sender, content FROM messages WHERE debate_id = ? ORDER BY created_at",
            (req.debate_id,)
        ).fetchall()

    # Save user message
    with get_db() as db:
        db.execute(
            "INSERT INTO messages (debate_id, sender, content) VALUES (?, ?, ?)",
            (req.debate_id, "User", req.user_message)
        )
        db.commit()

    # Get agents from messages
    agent_msgs = [(m["sender"], m["content"]) for m in messages if m["sender"] != "User"]
    agent_names = list(set(m[0] for m in agent_msgs))

    # Use first agent to respond
    with get_db() as db:
        first_agent_msg = db.execute(
            "SELECT agent_id, sender FROM messages WHERE debate_id = ? AND agent_id IS NOT NULL LIMIT 1",
            (req.debate_id,)
        ).fetchone()

    provider = "anthropic"
    model = PROVIDER_DEFAULTS["anthropic"]["default_model"]
    config = get_provider_config(user_id, provider)

    system = f"You are continuing a debate. A user just said: {req.user_message}. Respond as a debate participant."
    messages = [{"role": "user", "content": req.user_message}]

    async def respond_stream():
        full_response = ""
        yield json.dumps({"type": "agent_start", "agent_id": "response", "agent_name": "Agent", "color": "#C8FF00"}) + "\n"
        try:
            async for chunk in stream_chat(provider, config["base_url"], config["api_key"], model, system, messages):
                full_response += chunk
                yield json.dumps({"type": "chunk", "agent_id": "response", "content": chunk}) + "\n"
        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"
        clean = full_response.replace("**", "").replace("*", "").strip()
        with get_db() as db:
            db.execute(
                "INSERT INTO messages (debate_id, agent_id, sender, color, content, model_used) VALUES (?, ?, ?, ?, ?, ?)",
                (req.debate_id, "response", "Agent", "#C8FF00", clean, model)
            )
            db.commit()
        yield json.dumps({"type": "agent_done", "agent_id": "response", "full_response": clean}) + "\n"
        yield json.dumps({"type": "debate_done"}) + "\n"

    return StreamingResponse(respond_stream(), media_type="text/event-stream")
