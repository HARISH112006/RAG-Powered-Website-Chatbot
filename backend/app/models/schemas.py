from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Union

class UploadRequest(BaseModel):
    url: Optional[str] = None
    text: Optional[str] = None
    # PDF will be handled via multipart/form-data

class UploadResponse(BaseModel):
    document_id: str
    summary: str
    key_points: List[str]

class QueryRequest(BaseModel):
    question: str
    mode: str = "human" # human | technical | interview

class Source(BaseModel):
    document: str
    chunk: str

class QueryResponse(BaseModel):
    answer: Union[str, dict]
    sources: List[Source]
    confidence_score: float

class HealthResponse(BaseModel):
    status: str
    llm_connected: bool
