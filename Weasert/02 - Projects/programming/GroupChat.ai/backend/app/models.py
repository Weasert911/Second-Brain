from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .db import Base


class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    topic = Column(String, nullable=True)
    status = Column(String, default="idle")
    debate_mode = Column(String, default="discussion")
    total_messages = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    max_messages = Column(Integer, default=200)
    max_tokens = Column(Integer, default=500000)
    debate_speed = Column(Float, default=1.0)

    messages = relationship("Message", back_populates="session", cascade="all, delete")
    agents = relationship("Agent", back_populates="session", cascade="all, delete")
    summaries = relationship("Summary", back_populates="session", cascade="all, delete")
    arguments = relationship("Argument", back_populates="session", cascade="all, delete")
    bookmarks = relationship("Bookmark", back_populates="session", cascade="all, delete")
    pinned = relationship("PinnedMessage", back_populates="session", cascade="all, delete")
    decisions = relationship("Decision", back_populates="session", cascade="all, delete")
    cost_entries = relationship("CostEntry", back_populates="session", cascade="all, delete")


class Agent(Base):
    __tablename__ = "agents"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    role = Column(String, default="participant")
    expertise = Column(String, default="")
    temperature = Column(String, default="0.7")
    model = Column(String, default="llama-3.3-70b-versatile")
    system_prompt = Column(Text, nullable=False)
    enabled = Column(Boolean, default=True)

    session = relationship("Session", back_populates="agents")
    state = relationship("AgentState", back_populates="agent", uselist=False, cascade="all, delete")


class AgentState(Base):
    __tablename__ = "agent_states"
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), unique=True)
    beliefs = Column(Text, default="[]")
    confidence = Column(Float, default=0.5)
    previous_arguments = Column(Text, default="[]")
    open_questions = Column(Text, default="[]")
    messages_spoken = Column(Integer, default=0)
    last_spoke_at = Column(DateTime, nullable=True)
    trust_scores = Column(Text, default="{}")

    agent = relationship("Agent", back_populates="state")


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    agent_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    message_type = Column(String, default="normal")
    is_bookmarked = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    tokens_used = Column(Integer, default=0)
    reply_to_id = Column(Integer, nullable=True)

    session = relationship("Session", back_populates="messages")


class Argument(Base):
    __tablename__ = "arguments"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    message_id = Column(Integer, ForeignKey("messages.id"), nullable=True)
    agent_name = Column(String, nullable=False)
    claim = Column(Text, nullable=False)
    stance = Column(String, default="neutral")
    confidence = Column(Float, default=0.5)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="arguments")
    edges_from = relationship("ArgumentEdge", foreign_keys="ArgumentEdge.from_argument_id", back_populates="from_argument")
    edges_to = relationship("ArgumentEdge", foreign_keys="ArgumentEdge.to_argument_id", back_populates="to_argument")


class ArgumentEdge(Base):
    __tablename__ = "argument_edges"
    id = Column(Integer, primary_key=True, index=True)
    from_argument_id = Column(Integer, ForeignKey("arguments.id"))
    to_argument_id = Column(Integer, ForeignKey("arguments.id"))
    edge_type = Column(String, nullable=False)

    from_argument = relationship("Argument", foreign_keys=[from_argument_id], back_populates="edges_from")
    to_argument = relationship("Argument", foreign_keys=[to_argument_id], back_populates="edges_to")


class Summary(Base):
    __tablename__ = "summaries"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    message_range_start = Column(Integer, nullable=False)
    message_range_end = Column(Integer, nullable=False)
    consensus = Column(Text, default="")
    disagreements = Column(Text, default="")
    insights = Column(Text, default="")
    unanswered = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="summaries")


class Bookmark(Base):
    __tablename__ = "bookmarks"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    message_id = Column(Integer, ForeignKey("messages.id"))
    note = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="bookmarks")


class PinnedMessage(Base):
    __tablename__ = "pinned_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    message_id = Column(Integer, ForeignKey("messages.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="pinned")


class Decision(Base):
    __tablename__ = "decisions"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    recommendation = Column(Text, nullable=False)
    pros = Column(Text, default="[]")
    cons = Column(Text, default="[]")
    confidence_score = Column(Float, default=0.5)
    minority_opinions = Column(Text, default="[]")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="decisions")


class CostEntry(Base):
    __tablename__ = "cost_entries"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    agent_name = Column(String, nullable=False)
    model = Column(String, nullable=False)
    tokens_in = Column(Integer, default=0)
    tokens_out = Column(Integer, default=0)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="cost_entries")


class SessionMemory(Base):
    __tablename__ = "session_memories"
    id = Column(Integer, primary_key=True, index=True)
    source_session_id = Column(Integer, ForeignKey("sessions.id"))
    recalled_session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    memory_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
