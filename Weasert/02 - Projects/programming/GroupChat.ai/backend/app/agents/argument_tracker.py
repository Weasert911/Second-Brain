import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Argument, ArgumentEdge, Message


class ArgumentTracker:
    def __init__(self, db: AsyncSession, session_id: int):
        self.db = db
        self.session_id = session_id
        self._arguments: Dict[int, Dict[str, Any]] = {}
        self._edges: List[Dict[str, Any]] = []

    async def extract_and_save_arguments(
        self, message_id: int, agent_name: str, response: str
    ) -> List[Dict[str, Any]]:
        claims = self._extract_claims(response)
        saved = []

        for claim_data in claims:
            arg = Argument(
                session_id=self.session_id,
                message_id=message_id,
                agent_name=agent_name,
                claim=claim_data.get("claim", response[:200]),
                stance=claim_data.get("stance", "neutral"),
                confidence=claim_data.get("confidence", 0.5),
            )
            self.db.add(arg)
            await self.db.flush()

            self._arguments[arg.id] = {
                "id": arg.id,
                "agent_name": agent_name,
                "claim": arg.claim,
                "stance": arg.stance,
                "confidence": arg.confidence,
                "message_id": message_id,
            }
            saved.append(self._arguments[arg.id])

        return saved

    async def link_arguments(
        self, from_id: int, to_id: int, edge_type: str
    ):
        edge = ArgumentEdge(
            from_argument_id=from_id,
            to_argument_id=to_id,
            edge_type=edge_type,
        )
        self.db.add(edge)
        await self.db.flush()
        self._edges.append({
            "from": from_id,
            "to": to_id,
            "type": edge_type,
        })

    async def find_related_arguments(
        self, agent_name: str, response: str
    ) -> List[Dict[str, Any]]:
        related = []
        response_lower = response.lower()

        for arg_id, arg in self._arguments.items():
            if arg["agent_name"] == agent_name:
                continue
            claim_lower = arg["claim"].lower()
            overlap = self._calculate_overlap(response_lower, claim_lower)
            if overlap > 0.2:
                related.append({
                    **arg,
                    "relevance": overlap,
                })

        related.sort(key=lambda x: x["relevance"], reverse=True)
        return related[:5]

    async def get_argument_graph(self) -> Dict[str, Any]:
        nodes = list(self._arguments.values())
        edges = self._edges
        return {"nodes": nodes, "edges": edges}

    async def get_agent_arguments(self, agent_name: str) -> List[Dict[str, Any]]:
        return [
            arg for arg in self._arguments.values()
            if arg["agent_name"] == agent_name
        ]

    async def get_argument_summary(self) -> Dict[str, Any]:
        by_agent: Dict[str, List[Dict]] = {}
        for arg in self._arguments.values():
            name = arg["agent_name"]
            if name not in by_agent:
                by_agent[name] = []
            by_agent[name].append(arg)

        by_stance = {"support": [], "challenge": [], "build": [], "neutral": []}
        for arg in self._arguments.values():
            stance = arg.get("stance", "neutral")
            if stance in by_stance:
                by_stance[stance].append(arg)

        return {
            "total_arguments": len(self._arguments),
            "by_agent": {k: len(v) for k, v in by_agent.items()},
            "by_stance": {k: len(v) for k, v in by_stance.items()},
            "total_edges": len(self._edges),
        }

    def _extract_claims(self, text: str) -> List[Dict[str, Any]]:
        claims = []
        sentences = [s.strip() for s in text.replace(".", ".\n").split("\n") if s.strip()]

        for sentence in sentences[:3]:
            stance = "neutral"
            lower = sentence.lower()
            if any(w in lower for w in ["agree", "exactly", "right", "true", "correct"]):
                stance = "support"
            elif any(w in lower for w in ["disagree", "wrong", "no", "incorrect", "but", "however"]):
                stance = "challenge"
            elif any(w in lower for w in ["building on", "extending", "also", "furthermore", "additionally"]):
                stance = "build"

            claims.append({
                "claim": sentence[:300],
                "stance": stance,
                "confidence": 0.5,
            })

        return claims if claims else [{"claim": text[:300], "stance": "neutral", "confidence": 0.5}]

    def _calculate_overlap(self, text1: str, text2: str) -> float:
        words1 = set(text1.split())
        words2 = set(text2.split())
        if not words1 or not words2:
            return 0.0
        intersection = words1 & words2
        union = words1 | words2
        return len(intersection) / max(len(union), 1)
