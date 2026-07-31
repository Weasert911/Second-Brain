from typing import Any, Dict


class CostTracker:
    def __init__(self, max_tokens: int = 500000, max_messages: int = 200):
        self.max_tokens = max_tokens
        self.max_messages = max_messages
        self._total_tokens = 0
        self._total_messages = 0
        self._per_agent: Dict[str, Dict[str, int]] = {}

    def can_afford(self, estimated_tokens: int = 500) -> bool:
        if self._total_messages >= self.max_messages:
            return False
        if self._total_tokens + estimated_tokens >= self.max_tokens:
            return False
        return True

    def record_usage(self, agent_name: str, tokens_in: int, tokens_out: int) -> None:
        self._total_tokens += tokens_in + tokens_out
        self._total_messages += 1

        if agent_name not in self._per_agent:
            self._per_agent[agent_name] = {"tokens_in": 0, "tokens_out": 0, "messages": 0}
        self._per_agent[agent_name]["tokens_in"] += tokens_in
        self._per_agent[agent_name]["tokens_out"] += tokens_out
        self._per_agent[agent_name]["messages"] += 1

    def get_summary(self) -> Dict[str, Any]:
        return {
            "total_tokens": self._total_tokens,
            "total_messages": self._total_messages,
            "per_agent": self._per_agent,
            "remaining_tokens": max(0, self.max_tokens - self._total_tokens),
            "remaining_messages": max(0, self.max_messages - self._total_messages),
            "utilization": {
                "tokens_pct": round(self._total_tokens / self.max_tokens * 100, 1),
                "messages_pct": round(self._total_messages / self.max_messages * 100, 1),
            },
        }

    def get_budget_display(self) -> str:
        remaining = self.max_tokens - self._total_tokens
        pct = round(self._total_tokens / self.max_tokens * 100, 1)
        cost_est = (self._total_tokens / 1000) * 0.0005
        return (
            f"Messages: {self._total_messages} | "
            f"Tokens: {self._total_tokens:,} | "
            f"Cost: ${cost_est:.2f} | "
            f"Active Agents: {len(self._per_agent)}"
        )

    def get_budget_display_data(self) -> Dict[str, Any]:
        cost_est = (self._total_tokens / 1000) * 0.0005
        return {
            "total_messages": self._total_messages,
            "total_tokens": self._total_tokens,
            "estimated_cost_usd": round(cost_est, 4),
            "active_agents": len(self._per_agent),
            "remaining_tokens": max(0, self.max_tokens - self._total_tokens),
            "remaining_messages": max(0, self.max_messages - self._total_messages),
            "per_agent": self._per_agent,
        }
