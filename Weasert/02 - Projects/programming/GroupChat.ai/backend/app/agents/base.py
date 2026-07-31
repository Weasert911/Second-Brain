# backend/app/agents/base.py
import abc
from typing import Any, Dict, List


class BaseAgent(abc.ABC):
    def __init__(self, name: str, system_prompt: str, model: str, temperature: float):
        self.name = name
        self.system_prompt = system_prompt
        self.model = model
        self.temperature = temperature

    @abc.abstractmethod
    async def generate(self, context: List[Dict[str, Any]]) -> str:
        """Return the next response for this agent."""
        raise NotImplementedError
