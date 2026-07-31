import random
from datetime import datetime, timezone
from typing import Dict, List, Optional

from .state_manager import AgentStateManager


class SmartTurnSelector:
    def __init__(self, state_manager: AgentStateManager, cooldown_seconds: float = 5.0):
        self.state_manager = state_manager
        self.cooldown_seconds = cooldown_seconds
        self._turn_history: List[str] = []
        self._last_agent: Optional[str] = None

    def select_next(
        self,
        available_agents: List[str],
        last_response: str = "",
        force_agent: Optional[str] = None,
    ) -> str:
        if force_agent and force_agent in available_agents:
            return force_agent

        if not available_agents:
            return ""

        mentioned = self.state_manager.get_mentioned_agents(last_response)

        eligible = [
            a for a in available_agents
            if not self.state_manager.is_on_cooldown(a, self.cooldown_seconds)
        ]

        if not eligible:
            eligible = available_agents

        scores: Dict[str, float] = {}

        for agent in eligible:
            score = 0.0

            if agent in mentioned:
                score += 25.0

            recency = self._get_recency_score(agent)
            score += recency * 15.0

            if agent == self._last_agent:
                score -= 15.0

            recent_turns = self._turn_history[-10:]
            appearances = recent_turns.count(agent)
            score -= appearances * 5.0

            state = self.state_manager.get_state(agent)
            messages_spoken = state.get("messages_spoken", 0)
            avg_messages = sum(
                self.state_manager.get_state(a).get("messages_spoken", 0)
                for a in eligible
            ) / max(len(eligible), 1)
            if messages_spoken < avg_messages:
                score += 8.0

            expertise_bonus = self._get_expertise_bonus(agent, last_response)
            score += expertise_bonus

            scores[agent] = max(0.1, score + random.uniform(0, 3.0))

        selected = max(scores, key=scores.get)
        self._last_agent = selected
        self._turn_history.append(selected)
        if len(self._turn_history) > 20:
            self._turn_history = self._turn_history[-20:]

        return selected

    def should_speak(
        self,
        agent_name: str,
        last_response: str,
        all_agents: List[str],
    ) -> bool:
        mentioned = self.state_manager.get_mentioned_agents(last_response)
        if agent_name in mentioned:
            return True

        if self.state_manager.is_on_cooldown(agent_name, self.cooldown_seconds):
            return False

        recent_turns = self._turn_history[-5:]
        if recent_turns.count(agent_name) >= 2:
            return False

        return random.random() < 0.3

    def _get_recency_score(self, agent_name: str) -> float:
        state = self.state_manager.get_state(agent_name)
        last_spoke = state.get("last_spoke_at")
        if not last_spoke:
            return 1.0
        diff = (datetime.now(timezone.utc) - last_spoke).total_seconds()
        return min(1.0, diff / 30.0)

    def _get_expertise_bonus(self, agent_name: str, context: str) -> float:
        from .defaults import DEFAULT_AGENTS
        for spec in DEFAULT_AGENTS:
            if spec["name"] == agent_name:
                expertise = spec.get("expertise", "").lower()
                context_lower = context.lower()
                keywords = [k.strip() for k in expertise.split(",")]
                matches = sum(1 for k in keywords if k in context_lower)
                return matches * 3.0
        return 0.0
