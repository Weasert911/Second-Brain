import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import PlainTextResponse
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .. import db, models, schemas

router = APIRouter(prefix="/api", tags=["api"])


# ── Workspaces ───────────────────────────────────────────────────────

@router.post("/workspaces", response_model=schemas.WorkspaceRead)
async def create_workspace(body: schemas.WorkspaceCreate, db: AsyncSession = Depends(db.get_db)):
    ws = models.Workspace(**body.model_dump())
    db.add(ws)
    await db.commit()
    await db.refresh(ws)
    return ws


@router.get("/workspaces", response_model=list[schemas.WorkspaceRead])
async def list_workspaces(db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Workspace).order_by(models.Workspace.created_at.desc()))
    return result.scalars().all()


@router.get("/workspaces/{workspace_id}", response_model=schemas.WorkspaceRead)
async def get_workspace(workspace_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Workspace).where(models.Workspace.id == workspace_id))
    ws = result.scalar_one_or_none()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws


@router.patch("/workspaces/{workspace_id}")
async def update_workspace(workspace_id: int, body: dict, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Workspace).where(models.Workspace.id == workspace_id))
    ws = result.scalar_one_or_none()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    for key, value in body.items():
        if hasattr(ws, key):
            setattr(ws, key, value)
    ws.updated_at = datetime.now(timezone.utc)
    await db.commit()
    return {"ok": True}


@router.delete("/workspaces/{workspace_id}")
async def delete_workspace(workspace_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Workspace).where(models.Workspace.id == workspace_id))
    ws = result.scalar_one_or_none()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    await db.delete(ws)
    await db.commit()
    return {"ok": True}


# ── Sessions ──────────────────────────────────────────────────────────

@router.post("/sessions", response_model=schemas.SessionBrief)
async def create_session(body: dict = {}, db: AsyncSession = Depends(db.get_db)):
    sess = models.Session(
        topic=body.get("topic"),
        debate_mode=body.get("debate_mode", "discussion"),
        workspace_id=body.get("workspace_id"),
    )
    db.add(sess)
    await db.commit()
    await db.refresh(sess)
    return sess


@router.get("/sessions", response_model=list[schemas.SessionBrief])
async def list_sessions(
    search: str = Query("", description="Search by topic"),
    workspace_id: int = Query(None, description="Filter by workspace"),
    db: AsyncSession = Depends(db.get_db),
):
    query = select(models.Session).order_by(models.Session.created_at.desc())
    if search:
        query = query.where(models.Session.topic.ilike(f"%{search}%"))
    if workspace_id:
        query = query.where(models.Session.workspace_id == workspace_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/sessions/{session_id}", response_model=schemas.SessionRead)
async def get_session(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.Session)
        .where(models.Session.id == session_id)
        .options(
            selectinload(models.Session.agents),
            selectinload(models.Session.messages),
            selectinload(models.Session.summaries),
            selectinload(models.Session.decisions),
        )
    )
    sess = result.scalar_one_or_none()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return sess


@router.patch("/sessions/{session_id}")
async def update_session(session_id: int, body: schemas.SessionUpdate, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Session).where(models.Session.id == session_id))
    sess = result.scalar_one_or_none()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(sess, key, value)
    sess.updated_at = datetime.now(timezone.utc)
    await db.commit()
    return {"ok": True}


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Session).where(models.Session.id == session_id))
    sess = result.scalar_one_or_none()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(sess)
    await db.commit()
    return {"ok": True}


# ── Agents ────────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/agents", response_model=list[schemas.AgentRead])
async def list_agents(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.Agent).where(models.Agent.session_id == session_id)
    )
    return result.scalars().all()


@router.post("/sessions/{session_id}/agents", response_model=schemas.AgentRead)
async def create_agent(session_id: int, body: schemas.AgentCreate, db: AsyncSession = Depends(db.get_db)):
    agent = models.Agent(session_id=session_id, **body.model_dump())
    db.add(agent)
    await db.flush()
    state = models.AgentState(agent_id=agent.id)
    db.add(state)
    await db.commit()
    await db.refresh(agent)
    return agent


@router.patch("/agents/{agent_id}", response_model=schemas.AgentRead)
async def update_agent(agent_id: int, body: schemas.AgentUpdate, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Agent).where(models.Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(agent, key, value)
    await db.commit()
    await db.refresh(agent)
    return agent


@router.delete("/agents/{agent_id}")
async def delete_agent(agent_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Agent).where(models.Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    await db.delete(agent)
    await db.commit()
    return {"ok": True}


@router.patch("/agents/{agent_id}/toggle")
async def toggle_agent(agent_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Agent).where(models.Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent.enabled = not agent.enabled
    await db.commit()
    return {"enabled": agent.enabled}


# ── Agent Relationships ──────────────────────────────────────────────

@router.get("/sessions/{session_id}/relationships", response_model=list[schemas.RelationshipRead])
async def list_relationships(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.AgentRelationship).where(models.AgentRelationship.session_id == session_id)
    )
    return result.scalars().all()


# ── Messages ──────────────────────────────────────────────────────────

@router.patch("/messages/{message_id}/bookmark")
async def toggle_bookmark(message_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Message).where(models.Message.id == message_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_bookmarked = not msg.is_bookmarked
    await db.commit()
    return {"is_bookmarked": msg.is_bookmarked}


@router.patch("/messages/{message_id}/pin")
async def toggle_pin(message_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(select(models.Message).where(models.Message.id == message_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_pinned = not msg.is_pinned
    await db.commit()
    return {"is_pinned": msg.is_pinned}


# ── Decision Branches ────────────────────────────────────────────────

@router.post("/sessions/{session_id}/branches", response_model=schemas.BranchRead)
async def create_branch(session_id: int, body: schemas.BranchCreate, db: AsyncSession = Depends(db.get_db)):
    branch = models.DecisionBranch(
        session_id=session_id,
        parent_message_id=body.parent_message_id,
        parent_branch_id=body.parent_branch_id,
        label=body.label,
        description=body.description,
    )
    db.add(branch)
    await db.commit()
    await db.refresh(branch)
    return branch


@router.get("/sessions/{session_id}/branches", response_model=list[schemas.BranchRead])
async def list_branches(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.DecisionBranch).where(models.DecisionBranch.session_id == session_id)
    )
    return result.scalars().all()


@router.get("/branches/{branch_id}/messages", response_model=list[schemas.MessageRead])
async def get_branch_messages(branch_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.Message).where(models.Message.branch_id == branch_id).order_by(models.Message.timestamp)
    )
    return result.scalars().all()


# ── Search ────────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/search", response_model=schemas.SearchResults)
async def search_messages(
    session_id: int,
    q: str = Query("", description="Search query"),
    agent: str = Query("", description="Filter by agent name"),
    db: AsyncSession = Depends(db.get_db),
):
    query = select(models.Message).where(models.Message.session_id == session_id)
    if q:
        query = query.where(models.Message.content.ilike(f"%{q}%"))
    if agent:
        query = query.where(models.Message.agent_name == agent)
    query = query.order_by(models.Message.timestamp.desc())
    result = await db.execute(query)
    messages = result.scalars().all()
    return schemas.SearchResults(messages=messages, total=len(messages))


# ── Export ────────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/export/{fmt}")
async def export_session(session_id: int, fmt: str, db: AsyncSession = Depends(db.get_db)):
    if fmt not in ("markdown", "text", "json"):
        raise HTTPException(status_code=400, detail="Format must be markdown, text, or json")

    result = await db.execute(
        select(models.Session)
        .where(models.Session.id == session_id)
        .options(
            selectinload(models.Session.messages),
            selectinload(models.Session.summaries),
            selectinload(models.Session.decisions),
        )
    )
    sess = result.scalar_one_or_none()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    if fmt == "json":
        data = schemas.ExportData(
            topic=sess.topic or "",
            messages=sess.messages,
            summaries=sess.summaries,
            decisions=sess.decisions,
            exported_at=datetime.now(timezone.utc),
        )
        return PlainTextResponse(json.dumps(data.model_dump(), default=str, indent=2), media_type="application/json")

    lines = []
    lines.append(f"# {sess.topic or 'Untitled Debate'}")
    lines.append(f"Exported: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    lines.append(f"Messages: {len(sess.messages)}")
    lines.append("")

    for msg in sess.messages:
        if fmt == "markdown":
            lines.append(f"**{msg.agent_name}** [{msg.timestamp.strftime('%H:%M')}]:")
            lines.append(f"{msg.content}")
            lines.append("")
        else:
            lines.append(f"{msg.agent_name} [{msg.timestamp.strftime('%H:%M')}]: {msg.content}")

    if sess.summaries:
        lines.append("")
        lines.append("--- Summaries ---")
        for s in sess.summaries:
            lines.append(f"\n[Messages {s.message_range_start}-{s.message_range_end}]")
            if s.consensus:
                lines.append(f"Consensus: {s.consensus}")
            if s.disagreements:
                lines.append(f"Disagreements: {s.disagreements}")
            if s.insights:
                lines.append(f"Insights: {s.insights}")

    if sess.decisions:
        lines.append("")
        lines.append("--- Decisions ---")
        for d in sess.decisions:
            lines.append(f"\nRecommendation: {d.recommendation}")
            lines.append(f"Confidence: {d.confidence_score}")

    content = "\n".join(lines)
    media_type = "text/markdown" if fmt == "markdown" else "text/plain"
    return PlainTextResponse(content, media_type=media_type)


# ── Summaries ─────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/summaries", response_model=list[schemas.SummaryRead])
async def list_summaries(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.Summary).where(models.Summary.session_id == session_id).order_by(models.Summary.created_at)
    )
    return result.scalars().all()


# ── Decisions ─────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/decisions", response_model=list[schemas.DecisionRead])
async def list_decisions(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.Decision).where(models.Decision.session_id == session_id).order_by(models.Decision.created_at)
    )
    return result.scalars().all()


# ── Pinned Messages ──────────────────────────────────────────────────

@router.get("/sessions/{session_id}/pinned", response_model=list[schemas.MessageRead])
async def list_pinned(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.Message).where(
            models.Message.session_id == session_id,
            models.Message.is_pinned == True,
        )
    )
    return result.scalars().all()


# ── Cost Tracking ────────────────────────────────────────────────────

@router.get("/sessions/{session_id}/costs")
async def get_session_costs(session_id: int, db: AsyncSession = Depends(db.get_db)):
    result = await db.execute(
        select(models.CostEntry).where(models.CostEntry.session_id == session_id)
    )
    entries = result.scalars().all()

    total_in = sum(e.tokens_in for e in entries)
    total_out = sum(e.tokens_out for e in entries)

    per_agent = {}
    for e in entries:
        if e.agent_name not in per_agent:
            per_agent[e.agent_name] = {"tokens_in": 0, "tokens_out": 0, "count": 0}
        per_agent[e.agent_name]["tokens_in"] += e.tokens_in
        per_agent[e.agent_name]["tokens_out"] += e.tokens_out
        per_agent[e.agent_name]["count"] += 1

    # Rough cost estimate (Groq pricing)
    cost_per_1k = 0.0005
    estimated_cost = (total_in + total_out) / 1000 * cost_per_1k

    return {
        "total_tokens_in": total_in,
        "total_tokens_out": total_out,
        "per_agent": per_agent,
        "estimated_cost_usd": round(estimated_cost, 4),
        "message_count": len(entries),
    }
