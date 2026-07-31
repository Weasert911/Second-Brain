from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class AgentCreate(BaseModel):
    name: str
    avatar: Optional[str] = None
    role: str = "participant"
    expertise: str = ""
    temperature: float = 0.7
    model: str = "llama-3.3-70b-versatile"
    system_prompt: str
    enabled: bool = True


class AgentRead(AgentCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class AgentStateRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    beliefs: str = "[]"
    confidence: float = 0.5
    previous_arguments: str = "[]"
    open_questions: str = "[]"
    messages_spoken: int = 0


class MessageCreate(BaseModel):
    agent_name: str
    content: str
    message_type: str = "normal"


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    agent_name: str
    content: str
    timestamp: datetime
    message_type: str = "normal"
    is_bookmarked: bool = False
    is_pinned: bool = False
    tokens_used: int = 0


class ArgumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    agent_name: str
    claim: str
    stance: str
    confidence: float
    created_at: datetime


class SummaryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    message_range_start: int
    message_range_end: int
    consensus: str
    disagreements: str
    insights: str
    unanswered: str
    created_at: datetime


class DecisionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    recommendation: str
    pros: str = "[]"
    cons: str = "[]"
    confidence_score: float = 0.5
    minority_opinions: str = "[]"
    created_at: datetime


class BookmarkRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    message_id: int
    note: str
    created_at: datetime


class SessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    topic: Optional[str] = None
    total_messages: int = 0
    total_tokens: int = 0
    max_messages: int = 200
    max_tokens: int = 500000
    is_decision_mode: bool = False
    is_research_mode: bool = False
    agents: List[AgentRead] = []
    messages: List[MessageRead] = []
    summaries: List[SummaryRead] = []
    decisions: List[DecisionRead] = []


class SessionBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    topic: Optional[str] = None
    total_messages: int = 0


class CostSummary(BaseModel):
    total_tokens: int = 0
    total_messages: int = 0
    per_agent: dict = {}
    remaining_tokens: int = 500000
    remaining_messages: int = 200


class SearchResults(BaseModel):
    messages: List[MessageRead] = []
    total: int = 0


class ExportData(BaseModel):
    topic: str = ""
    messages: List[MessageRead] = []
    summaries: List[SummaryRead] = []
    decisions: List[DecisionRead] = []
    exported_at: datetime
