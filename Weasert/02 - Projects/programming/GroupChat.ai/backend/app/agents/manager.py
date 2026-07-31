import asyncio
import random
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import (
    Agent,
    AgentRelationship,
    CostEntry,
    DecisionBranch,
    Message,
    Session,
    WorkspaceMemory,
)
from ..utils.openai_client import get_ai_response
from .cache import ResponseCache
from .cost_tracker import CostTracker
from .defaults import (
    DEFAULT_AGENT_NAMES,
    SimpleAgent,
    get_default_agent_spec,
    get_model_for_tier,
)
from .identities import (
    SUMMONABLE_EXPERTS,
    AgentIdentity,
    get_identity,
    get_identity_prompt,
)
from .loop_detector import LoopDetector
from .state_manager import AgentStateManager
from .summarizer import DebateSummarizer
from .turn_selector import SmartTurnSelector


class DebateManager:
    def __init__(self, db: AsyncSession, ws):
        self.db = db
        self.ws = ws
        self.running = False
        self.debate_task: Optional[asyncio.Task] = None
        self.session: Optional[Session] = None
        self.agents: List[SimpleAgent] = []
        self.history: List[Dict[str, Any]] = []
        self.all_messages: List[Dict[str, Any]] = []

        self.state_manager = AgentStateManager()
        self.turn_selector = SmartTurnSelector(self.state_manager)
        self.cost_tracker = CostTracker()
        self.summarizer = DebateSummarizer()
        self.loop_detector = LoopDetector()
        self.cache = ResponseCache()

        self._no_new_args_count = 0

    async def init_session(self, topic: str, debate_mode: str = "discussion", speed: float = 1.0):
        self.session = Session(topic=topic, debate_mode=debate_mode, debate_speed=speed, status="active")
        self.db.add(self.session)
        await self.db.flush()

        for name in DEFAULT_AGENT_NAMES:
            spec = get_default_agent_spec(name)
            if not spec:
                continue

            db_agent = Agent(
                session_id=self.session.id,
                name=spec["name"],
                full_name=spec.get("full_name"),
                avatar=spec["avatar"],
                tagline=spec.get("tagline"),
                role=spec.get("role", "participant"),
                expertise=spec.get("expertise", ""),
                personality=spec.get("personality", ""),
                writing_style=spec.get("writing_style", ""),
                confidence=spec.get("confidence", 0.5),
                warmth=spec.get("warmth", 0.5),
                formality=spec.get("formality", 0.5),
                background=spec.get("background", ""),
                catchphrase=spec.get("catchphrase"),
                temperature=str(spec["temperature"]),
                model=spec["model"],
                system_prompt=spec["system_prompt"],
                enabled=True,
                color=spec.get("color", "#6c5cfc"),
                emoji=spec.get("emoji", ""),
            )
            self.db.add(db_agent)
            await self.db.flush()

            agent = SimpleAgent(
                name=spec["name"],
                system_prompt=spec["system_prompt"],
                model=spec["model"],
                temperature=spec["temperature"],
            )
            self.agents.append(agent)
            self.state_manager.init_state(spec["name"])

        self.history.append({"role": "user", "content": f"Topic: {topic}"})
        await self._save_message("System", f"Debate started: {topic}", msg_type="system")
        await self._broadcast_presence("all", "joined the discussion")

    async def _save_message(self, agent_name: str, content: str, msg_type: str = "normal", branch_id: int = None):
        msg = Message(
            session_id=self.session.id,
            agent_name=agent_name,
            content=content,
            message_type=msg_type,
            branch_id=branch_id,
        )
        self.db.add(msg)
        await self.db.flush()

        agent_identity = get_identity(agent_name)
        await self.ws.send_json({
            "type": "message",
            "agent": agent_name,
            "content": content,
            "id": msg.id,
            "message_type": msg_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "avatar": agent_identity.avatar if agent_identity else agent_name[:2].upper(),
            "color": agent_identity.color if agent_identity else "#6c5cfc",
            "full_name": agent_identity.full_name if agent_identity else agent_name,
            "tagline": agent_identity.tagline if agent_identity else "",
        })
        self.all_messages.append({
            "agent_name": agent_name,
            "content": content,
            "id": msg.id,
            "type": msg_type,
        })

        if self.session:
            self.session.total_messages = len(self.all_messages)
            self.session.updated_at = datetime.now(timezone.utc)
            await self.db.flush()

        return msg.id

    async def _broadcast_presence(self, agent_name: str, action: str):
        await self.ws.send_json({
            "type": "presence",
            "agent": agent_name,
            "action": action,
        })

    async def _send_typing(self, agent_name: str, action: str = "typing"):
        actions = {
            "typing": "is typing",
            "reading": "is reading previous messages",
            "researching": "is researching",
            "thinking": "is thinking deeply",
        }
        await self.ws.send_json({
            "type": "typing",
            "agent": agent_name,
            "action": actions.get(action, action),
        })

    async def _stop_typing(self, agent_name: str):
        await self.ws.send_json({"type": "stop_typing", "agent": agent_name})

    async def _send_cost_update(self):
        cost_data = self.cost_tracker.get_budget_display_data()
        await self.ws.send_json({
            "type": "cost_update",
            "data": cost_data,
        })

    async def _run_debate(self):
        self.running = True
        try:
            while self.running:
                if self._should_auto_stop():
                    await self._handle_auto_stop()
                    break

                if not self.cost_tracker.can_afford():
                    await self._save_message("System", "Token budget exhausted. Stopping debate.", msg_type="system")
                    await self.stop()
                    break

                participant_agents = [
                    a for a in self.agents
                    if self._get_agent_spec(a.name).get("role") != "Moderator"
                ]

                next_agent_name = self.turn_selector.select_next(
                    [a.name for a in participant_agents],
                    self.all_messages[-1]["content"] if self.all_messages else "",
                )

                if not self.turn_selector.should_speak(
                    next_agent_name,
                    self.all_messages[-1]["content"] if self.all_messages else "",
                    [a.name for a in participant_agents],
                ):
                    await asyncio.sleep(random.uniform(0.5, 1.0))
                    continue

                agent = self._get_agent(next_agent_name)
                if not agent:
                    continue

                # Presence: reading/researching before typing
                reading_or_researching = random.choice(["reading", "researching", "thinking"])
                await self._send_typing(agent.name, reading_or_researching)
                await asyncio.sleep(random.uniform(1.0, 2.5))

                await self._send_typing(agent.name, "typing")
                await asyncio.sleep(random.uniform(0.5, 1.2))

                context = self._build_context(agent.name)
                raw_response = await agent.generate(context)
                clean_response = self._extract_clean_response(raw_response)

                word_count = len(clean_response.split())
                if word_count > 250:
                    clean_response = " ".join(clean_response.split()[:250]) + "..."

                self.state_manager.update_from_response(agent.name, raw_response)
                self.loop_detector.add_argument(clean_response)

                await self._stop_typing(agent.name)
                await self._save_message(agent.name, clean_response)
                self.history.append(
                    {"role": "assistant", "content": clean_response, "name": agent.name}
                )

                tokens_est = len(clean_response.split()) * 2
                self.cost_tracker.record_usage(agent.name, tokens_est // 3, tokens_est)

                # Record cost entry
                cost_entry = CostEntry(
                    session_id=self.session.id,
                    agent_name=agent.name,
                    model=agent.model,
                    tokens_in=tokens_est // 3,
                    tokens_out=tokens_est,
                )
                self.db.add(cost_entry)

                # Update agent relationships
                await self._update_relationships(agent.name, clean_response)

                await self._send_cost_update()

                self.summarizer.increment_message_count()

                if self.summarizer.should_summarize():
                    summary = await self.summarizer.generate_summary(self.all_messages)
                    await self.ws.send_json({"type": "summary", "data": summary})

                await asyncio.sleep(random.uniform(0.8, 2.0))
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"Debate error: {e}")

    def _build_context(self, agent_name: str) -> List[Dict[str, Any]]:
        context = []

        if self.session and self.session.topic:
            context.append({"role": "user", "content": f"Topic: {self.session.topic}"})

        if self.summarizer._last_summary:
            s = self.summarizer._last_summary
            parts = []
            if s.get("consensus"):
                parts.append(f"Consensus: {s['consensus']}")
            if s.get("disagreements"):
                parts.append(f"Disagreements: {s['disagreements']}")
            if s.get("insights"):
                parts.append(f"Key insights: {s['insights']}")
            if parts:
                context.append({"role": "user", "content": "Debate summary: " + " | ".join(parts)})

        # Add agent relationship context
        relationship_context = self._get_relationship_context(agent_name)
        if relationship_context:
            context.append({"role": "user", "content": relationship_context})

        recent = self.history[-10:] if self.history else []
        context.extend(recent)

        agent_memory = self.state_manager.get_compact_memory(agent_name)
        if agent_memory:
            context.append({
                "role": "user",
                "content": f"Your memory: {agent_memory}",
            })

        budget_display = self.cost_tracker.get_budget_display()
        context.append({"role": "user", "content": budget_display})

        return context

    def _get_relationship_context(self, agent_name: str) -> str:
        parts = []
        for other_agent in self.agents:
            if other_agent.name == agent_name:
                continue
            state = self.state_manager.get_state(agent_name)
            if state and "trust_scores" in state:
                trust = state["trust_scores"].get(other_agent.name, 0.5)
                if trust > 0.7:
                    parts.append(f"You generally agree with {other_agent.name}")
                elif trust < 0.3:
                    parts.append(f"You tend to disagree with {other_agent.name}")
        return "Relationship context: " + "; ".join(parts) if parts else ""

    async def _update_relationships(self, agent_name: str, content: str):
        for other_agent in self.agents:
            if other_agent.name == agent_name:
                continue

            content_lower = content.lower()
            other_lower = other_agent.name.lower()

            if other_lower in content_lower:
                agreeing = any(w in content_lower for w in ["agree", "right", "correct", "good point"])
                disagreeing = any(w in content_lower for w in ["disagree", "wrong", "no", "incorrect"])

                result = await self.db.execute(
                    select(AgentRelationship).where(
                        AgentRelationship.session_id == self.session.id,
                        AgentRelationship.agent_a == agent_name,
                        AgentRelationship.agent_b == other_agent.name,
                    )
                )
                rel = result.scalar_one_or_none()

                if not rel:
                    rel = AgentRelationship(
                        session_id=self.session.id,
                        agent_a=agent_name,
                        agent_b=other_agent.name,
                    )
                    self.db.add(rel)

                if agreeing:
                    rel.agreement_count += 1
                    rel.trust_score = min(1.0, rel.trust_score + 0.05)
                elif disagreeing:
                    rel.disagreement_count += 1
                    rel.trust_score = max(0.0, rel.trust_score - 0.05)

                rel.last_interaction = datetime.now(timezone.utc)

        await self.db.flush()

    def _extract_clean_response(self, text: str) -> str:
        marker = "---STATE---"
        idx = text.find(marker)
        if idx != -1:
            return text[:idx].strip()
        return text.strip()

    def _get_agent(self, name: str) -> Optional[SimpleAgent]:
        for a in self.agents:
            if a.name == name:
                return a
        return None

    def _get_agent_spec(self, name: str) -> Dict:
        spec = get_default_agent_spec(name)
        return spec if spec else {}

    def _should_auto_stop(self) -> bool:
        if self.session:
            if len(self.all_messages) >= self.session.max_messages:
                return True
        if self.loop_detector.detect_loop():
            return True
        if self._no_new_args_count >= 10:
            return True
        return False

    async def _handle_auto_stop(self):
        if self.loop_detector.detect_loop():
            msg = self.loop_detector.get_intervention_message()
            await self._save_message("System", msg, msg_type="system")
            self.loop_detector = LoopDetector()

        if len(self.all_messages) >= (self.session.max_messages if self.session else 200):
            await self._save_message("System", "Maximum message limit reached. Stopping debate.", msg_type="system")

        await self.stop()

    async def challenge(self, message_id: int, message_content: str, agent_name: str):
        agent = self._get_agent(agent_name)
        if not agent:
            return

        challenge_prompt = (
            f'Someone challenged this message: "{message_content}"\n'
            "Push back, defend your position, or concede if they have a point. Be direct."
        )

        await self._send_typing(agent.name, "thinking")
        await asyncio.sleep(random.uniform(0.3, 0.8))
        await self._send_typing(agent.name, "typing")

        msgs = [{"role": "system", "content": agent.system_prompt}]
        msgs.extend(self.history[-10:])
        msgs.append({"role": "user", "content": challenge_prompt})

        response = await get_ai_response(
            model=agent.model,
            temperature=agent.temperature,
            messages=msgs,
        )

        clean_response = self._extract_clean_response(response)
        self.state_manager.update_from_response(agent.name, response)

        await self._stop_typing(agent.name)
        await self._save_message(agent.name, clean_response)
        self.history.append(
            {"role": "assistant", "content": clean_response, "name": agent.name}
        )

    async def challenge_all(self, message_id: int, message_content: str):
        for agent in self.agents:
            asyncio.create_task(self.challenge(message_id, message_content, agent.name))

    async def ask_group(self, question: str):
        self.history.append({"role": "user", "content": question})
        for agent in self.agents[:3]:
            asyncio.create_task(self._agent_respond_to_question(agent, question))

    async def _agent_respond_to_question(self, agent: SimpleAgent, question: str):
        await self._send_typing(agent.name, "thinking")
        await asyncio.sleep(random.uniform(0.5, 1.5))
        await self._send_typing(agent.name, "typing")

        msgs = [{"role": "system", "content": agent.system_prompt}]
        msgs.extend(self.history[-8:])
        msgs.append({"role": "user", "content": f"Answer this question briefly: {question}"})

        response = await get_ai_response(
            model=agent.model,
            temperature=agent.temperature,
            messages=msgs,
        )

        clean_response = self._extract_clean_response(response)
        self.state_manager.update_from_response(agent.name, response)

        await self._stop_typing(agent.name)
        await self._save_message(agent.name, clean_response)
        self.history.append(
            {"role": "assistant", "content": clean_response, "name": agent.name}
        )

    async def reach_decision(self):
        moderator = self._get_agent("Diana")
        if not moderator:
            moderator = self.agents[0] if self.agents else None
        if not moderator:
            return

        await self._send_typing(moderator.name, "thinking")
        await asyncio.sleep(1.0)
        await self._send_typing(moderator.name, "typing")

        decision_prompt = (
            "Based on the debate above, provide a clear recommendation. "
            "Include: 1) Your recommendation (2-3 sentences), "
            "2) Key pros (as a list), 3) Key cons (as a list), "
            "4) Your confidence level (0-100%). Be decisive."
        )

        msgs = [{"role": "system", "content": moderator.system_prompt}]
        msgs.extend(self.history[-15:])
        msgs.append({"role": "user", "content": decision_prompt})

        response = await get_ai_response(
            model=moderator.model,
            temperature=0.5,
            messages=msgs,
        )

        await self._stop_typing(moderator.name)

        decision_data = {
            "recommendation": response.strip(),
            "pros": [],
            "cons": [],
            "confidence_score": 0.7,
        }

        await self.ws.send_json({"type": "decision", "data": decision_data})
        await self._save_message(moderator.name, f"DECISION: {response.strip()}", msg_type="decision")

    async def explain_further(self, message_id: int, agent_name: str):
        agent = self._get_agent(agent_name)
        if not agent:
            return

        await self._send_typing(agent.name, "thinking")
        await asyncio.sleep(0.5)
        await self._send_typing(agent.name, "typing")

        msgs = [{"role": "system", "content": agent.system_prompt}]
        msgs.extend(self.history[-8:])
        msgs.append({"role": "user", "content": "Elaborate on your last point. Go deeper. Be specific."})

        response = await get_ai_response(
            model=agent.model,
            temperature=agent.temperature,
            messages=msgs,
        )

        clean_response = self._extract_clean_response(response)
        await self._stop_typing(agent.name)
        await self._save_message(agent.name, clean_response)
        self.history.append(
            {"role": "assistant", "content": clean_response, "name": agent.name}
        )

    async def what_are_we_missing(self):
        for agent in self.agents[:2]:
            asyncio.create_task(self._agent_find_blindspot(agent))

    async def _agent_find_blindspot(self, agent: SimpleAgent):
        await self._send_typing(agent.name, "thinking")
        await asyncio.sleep(1.0)
        await self._send_typing(agent.name, "typing")

        msgs = [{"role": "system", "content": agent.system_prompt}]
        msgs.extend(self.history[-10:])
        msgs.append({"role": "user", "content": (
            "What important perspective or risk has the group missed? "
            "What blind spot do you see? Be specific and contrarian."
        )})

        response = await get_ai_response(
            model=agent.model,
            temperature=agent.temperature,
            messages=msgs,
        )

        clean_response = self._extract_clean_response(response)
        await self._stop_typing(agent.name)
        await self._save_message(agent.name, f"[BLIND SPOT] {clean_response}")
        self.history.append(
            {"role": "assistant", "content": clean_response, "name": agent.name}
        )

    async def summon_expert(self, expert_key: str):
        if expert_key not in SUMMONABLE_EXPERTS:
            available = ", ".join(SUMMONABLE_EXPERTS.keys())
            await self._save_message("System", f"Unknown expert: {expert_key}. Available: {available}", msg_type="system")
            return

        identity = SUMMONABLE_EXPERTS[expert_key]
        spec = get_default_agent_spec(identity.name)
        if not spec:
            return

        db_agent = Agent(
            session_id=self.session.id,
            name=spec["name"],
            full_name=spec.get("full_name"),
            avatar=spec["avatar"],
            tagline=spec.get("tagline"),
            role=spec.get("role", "participant"),
            personality=spec.get("personality", ""),
            writing_style=spec.get("writing_style", ""),
            confidence=spec.get("confidence", 0.5),
            warmth=spec.get("warmth", 0.5),
            formality=spec.get("formality", 0.5),
            background=spec.get("background", ""),
            catchphrase=spec.get("catchphrase"),
            temperature=str(spec["temperature"]),
            model=spec["model"],
            system_prompt=spec["system_prompt"],
            enabled=True,
            is_summoned=True,
            color=spec.get("color", "#6c5cfc"),
            emoji=spec.get("emoji", ""),
        )
        self.db.add(db_agent)
        await self.db.flush()

        agent = SimpleAgent(
            name=spec["name"],
            system_prompt=spec["system_prompt"],
            model=spec["model"],
            temperature=spec["temperature"],
        )
        self.agents.append(agent)
        self.state_manager.init_state(spec["name"])

        await self._broadcast_presence(identity.name, "joined the discussion")
        await self._save_message("System", f"{identity.full_name} has joined the debate. {identity.tagline}.", msg_type="system")

        await self._send_typing(identity.name, "typing")
        await asyncio.sleep(1.0)

        intro_prompt = (
            f"You just joined an ongoing debate. Introduce yourself briefly in one sentence. "
            f"The topic is: {self.session.topic if self.session else 'general discussion'}"
        )

        msgs = [{"role": "system", "content": spec["system_prompt"]}]
        msgs.append({"role": "user", "content": intro_prompt})

        response = await get_ai_response(
            model=spec["model"],
            temperature=0.7,
            messages=msgs,
        )

        clean_response = self._extract_clean_response(response)
        await self._stop_typing(identity.name)
        await self._save_message(identity.name, clean_response)
        self.history.append(
            {"role": "assistant", "content": clean_response, "name": identity.name}
        )

        await self.ws.send_json({
            "type": "agent_joined",
            "agent": {
                "name": identity.name,
                "full_name": identity.full_name,
                "avatar": identity.avatar,
                "tagline": identity.tagline,
                "color": identity.color,
                "emoji": identity.emoji,
            },
        })

    async def create_branch(self, parent_message_id: int, label: str, description: str = ""):
        branch = DecisionBranch(
            session_id=self.session.id,
            parent_message_id=parent_message_id,
            label=label,
            description=description,
        )
        self.db.add(branch)
        await self.db.flush()

        await self.ws.send_json({
            "type": "branch_created",
            "branch_id": branch.id,
            "label": label,
            "description": description,
        })

        return branch

    async def save_workspace_memory(self, memory_type: str, content: str, workspace_id: int = None):
        if not workspace_id and self.session and self.session.workspace_id:
            workspace_id = self.session.workspace_id

        if not workspace_id:
            return

        memory = WorkspaceMemory(
            workspace_id=workspace_id,
            memory_type=memory_type,
            content=content,
            source_session_id=self.session.id if self.session else None,
        )
        self.db.add(memory)
        await self.db.flush()

    def get_session_info(self) -> Dict[str, Any]:
        return {
            "session_id": self.session.id if self.session else None,
            "topic": self.session.topic if self.session else None,
            "mode": self.session.debate_mode if self.session else "discussion",
            "cost_summary": self.cost_tracker.get_summary(),
            "agents": [
                {
                    "name": a.name,
                    "full_name": (get_identity(a.name).full_name if get_identity(a.name) else a.name),
                    "avatar": (get_identity(a.name).avatar if get_identity(a.name) else a.name[:2]),
                    "color": (get_identity(a.name).color if get_identity(a.name) else "#6c5cfc"),
                }
                for a in self.agents
            ],
        }

    async def get_relationships(self) -> List[Dict[str, Any]]:
        result = await self.db.execute(
            select(AgentRelationship).where(AgentRelationship.session_id == self.session.id)
        )
        rels = result.scalars().all()
        return [
            {
                "agent_a": r.agent_a,
                "agent_b": r.agent_b,
                "trust_score": r.trust_score,
                "agreement_count": r.agreement_count,
                "disagreement_count": r.disagreement_count,
            }
            for r in rels
        ]

    def start(self):
        if self.debate_task and not self.debate_task.done():
            return
        self.debate_task = asyncio.create_task(self._run_debate())

    async def stop(self):
        self.running = False
        if self.debate_task and not self.debate_task.done():
            self.debate_task.cancel()
            try:
                await self.debate_task
            except asyncio.CancelledError:
                pass

    def pause(self):
        self.running = False

    def resume(self):
        self.running = True
