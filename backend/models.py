from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class QueryRequest(BaseModel):
    question: str
    mode: Optional[str] = "human"
    language: Optional[str] = "en"
    short_answer: Optional[bool] = False

class UploadResponse(BaseModel):
    status: str
    message: str
    document_id: Optional[str] = None
    chunks_created: Optional[int] = None
    summary: Optional[str] = None

class Source(BaseModel):
    document: str
    chunk: str
    relevance_score: Optional[float] = None

class QueryResponse(BaseModel):
    answer: str
    context: str
    sources: List[Source] = []
    language: str = "en"
    processing_time_ms: Optional[int] = None
    confidence_score: Optional[float] = None
    followup_questions: Optional[List[str]] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    llm_configured: bool
    llm_provider: str
    total_documents: int
    uptime_seconds: float

class AnalyticsEntry(BaseModel):
    timestamp: datetime
    type: str
    data: Dict[str, Any]
    session_id: Optional[str] = None

class AnalyticsResponse(BaseModel):
    total_queries: int
    total_uploads: int
    most_asked_topics: List[str]
    recent_activity: List[AnalyticsEntry]