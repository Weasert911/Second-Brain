from typing import Any, Dict, List, Optional

from ..utils.openai_client import get_ai_response
from .cache import ResponseCache


class DebateSummarizer:
    def __init__(self, cache: Optional[ResponseCache] = None):
        self.cache = cache
        self._messages_since_last_summary = 0
        self._summary_interval = 20
        self._last_summary: Optional[Dict[str, Any]] = None

    def should_summarize(self) -> bool:
        return self._messages_since_last_summary >= self._summary_interval

    def increment_message_count(self):
        self._messages_since_last_summary += 1

    def reset_counter(self):
        self._messages_since_last_summary = 0

    async def generate_summary(
        self, messages: List[Dict[str, Any]], existing_summary: Optional[Dict] = None
    ) -> Dict[str, Any]:
        recent = messages[-30:] if len(messages) > 30 else messages

        if self.cache:
            msg_hash = self.cache.hash_messages(recent)
            cached = self.cache.get_cached_summary(msg_hash)
            if cached:
                self._last_summary = cached
                return cached

        conversation = "\n".join(
            f"{m.get('agent_name', 'Unknown')}: {m.get('content', '')[:150]}"
            for m in recent
        )

        prev_context = ""
        if existing_summary:
            prev_context = f"\nPrevious consensus: {existing_summary.get('consensus', 'none')}\n"

        prompt = (
            f"Summarize this debate concisely.\n"
            f"{prev_context}\n"
            f"Conversation:\n{conversation}\n\n"
            "Output JSON:\n"
            '{"consensus": "what everyone agrees on",'
            ' "disagreements": "where they disagree",'
            ' "insights": "key points",'
            ' "unanswered": "open questions"}'
        )

        response = await get_ai_response(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            messages=[{"role": "user", "content": prompt}],
        )

        try:
            parsed = json.loads(response)
        except (json.JSONDecodeError, ValueError):
            parsed = {
                "consensus": response[:300] if response else "Unable to generate",
                "disagreements": "",
                "insights": "",
                "unanswered": "",
            }

        self._last_summary = parsed
        self.reset_counter()

        if self.cache:
            msg_hash = self.cache.hash_messages(recent)
            self.cache.cache_summary(msg_hash, parsed)

        return parsed


import json
