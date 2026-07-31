import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class AgentStateManager:
    def __init__(self):
        self._states: Dict[str, Dict[str, Any]] = {}

    def init_state(self, agent_name: str) -> Dict[str, Any]:
        self._states[agent_name] = {
            "beliefs": [],
            "confidence": 0.5,
            "previous_arguments": [],
            "open_questions": [],
            "messages_spoken": 0,
            "last_spoke_at": None,
            "trust_scores": {},
            "cooldown_until": None,
        }
        return self._states[agent_name]

    def get_state(self, agent_name: str) -> Dict[str, Any]:
        return self._states.get(agent_name, {
            "beliefs": [],
            "confidence": 0.5,
            "previous_arguments": [],
            "open_questions": [],
            "messages_spoken": 0,
            "last_spoke_at": None,
            "trust_scores": {},
            "cooldown_until": None,
        })

    def update_from_response(self, agent_name: str, response: str) -> Dict[str, Any]:
        state = self.get_state(agent_name)
        state["messages_spoken"] = state.get("messages_spoken", 0) + 1
        state["last_spoke_at"] = datetime.now(timezone.utc)
        state["cooldown_until"] = None
        self._states[agent_name] = state
        return state

    def get_compact_memory(self, agent_name: str) -> str:
        state = self.get_state(agent_name)
        beliefs = state.get("beliefs", [])
        confidence = state.get("confidence", 0.5)
        args = state.get("previous_arguments", [])[-3:]

        parts = []
        if beliefs:
            parts.append(f"Beliefs: {'; '.join(beliefs[:3])}")
        parts.append(f"Confidence: {confidence:.0%}")
        if args:
            recent = args[-1].get("content_preview", "")
            parts.append(f"Recent argument: {recent[:80]}")

        return " | ".join(parts) if parts else ""

    def get_beliefs_summary(self, agent_name: str) -> str:
        state = self.get_state(agent_name)
        beliefs = state.get("beliefs", [])
        if not beliefs:
            return "No stated beliefs yet"
        return "; ".join(beliefs[:5])

    def update_last_spoke(self, agent_name: str):
        state = self.get_state(agent_name)
        state["last_spoke_at"] = datetime.now(timezone.utc)
        self._states[agent_name] = state

    def is_on_cooldown(self, agent_name: str, cooldown_seconds: float = 5.0) -> bool:
        state = self.get_state(agent_name)
        last_spoke = state.get("last_spoke_at")
        if not last_spoke:
            return False
        elapsed = (datetime.now(timezone.utc) - last_spoke).total_seconds()
        return elapsed < cooldown_seconds

    def get_mentioned_agents(self, response: str) -> List[str]:
        mentioned = []
        for name in self._states:
            if name.lower() in response.lower():
                mentioned.append(name)
        return mentioned
