import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select

from ..agents.manager import DebateManager
from ..db import AsyncSessionLocal
from ..models import Session

router = APIRouter()


@router.websocket("/ws/{session_id}")
async def ws_endpoint(websocket: WebSocket, session_id: int):
    await websocket.accept()

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Session).where(Session.id == session_id))
        session = result.scalar_one_or_none()
        if not session:
            await websocket.close(code=4004, reason="Session not found")
            return

        manager = DebateManager(db, websocket)

        try:
            while True:
                data = await websocket.receive_json()
                action = data.get("action")

                if action == "start":
                    topic = data.get("topic", "Untitled discussion")
                    mode = data.get("mode", "discussion")
                    speed = data.get("speed", 1.0)
                    await manager.init_session(topic, debate_mode=mode, speed=speed)
                    manager.start()

                elif action == "stop":
                    await manager.stop()

                elif action == "pause":
                    manager.pause()

                elif action == "resume":
                    manager.resume()

                elif action == "challenge":
                    message_id = data.get("message_id")
                    message_content = data.get("content", "")
                    agent_name = data.get("agent_name", "")
                    if message_id and agent_name:
                        asyncio.create_task(
                            manager.challenge(message_id, message_content, agent_name)
                        )

                elif action == "challenge_all":
                    message_id = data.get("message_id")
                    message_content = data.get("content", "")
                    if message_id:
                        asyncio.create_task(
                            manager.challenge_all(message_id, message_content)
                        )

                elif action == "ask_group":
                    question = data.get("question", "")
                    if question:
                        asyncio.create_task(manager.ask_group(question))

                elif action == "reach_decision":
                    asyncio.create_task(manager.reach_decision())

                elif action == "explain_further":
                    message_id = data.get("message_id")
                    agent_name = data.get("agent_name", "")
                    if message_id and agent_name:
                        asyncio.create_task(
                            manager.explain_further(message_id, agent_name)
                        )

                elif action == "what_are_we_missing":
                    asyncio.create_task(manager.what_are_we_missing())

                elif action == "summon":
                    expert_key = data.get("expert", "")
                    if expert_key:
                        asyncio.create_task(manager.summon_expert(expert_key))

                elif action == "create_branch":
                    parent_message_id = data.get("parent_message_id")
                    label = data.get("label", "Alternative path")
                    description = data.get("description", "")
                    if parent_message_id:
                        asyncio.create_task(
                            manager.create_branch(parent_message_id, label, description)
                        )

                elif action == "get_info":
                    info = manager.get_session_info()
                    await websocket.send_json({"type": "session_info", "data": info})

                elif action == "get_relationships":
                    relationships = await manager.get_relationships()
                    await websocket.send_json({"type": "relationships", "data": relationships})

        except WebSocketDisconnect:
            await manager.stop()
