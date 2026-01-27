import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "RAG Chatbot Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # LLM Configuration
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq")  # "openai" or "groq"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # File Upload Settings
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # RAG Configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RESULTS: int = 5
    
    # Storage Paths
    VECTOR_STORE_PATH: str = "./vector_db"
    ANALYTICS_FILE: str = "./analytics.json"
    UPLOAD_DIR: str = "./uploads"
    
    # Computed Properties
    @property
    def max_file_size_bytes(self) -> int:
        return self.MAX_FILE_SIZE_MB * 1024 * 1024
    
    @property
    def is_llm_configured(self) -> bool:
        if self.LLM_PROVIDER == "openai":
            return bool(self.OPENAI_API_KEY and self.OPENAI_API_KEY != "your_openai_api_key_here")
        elif self.LLM_PROVIDER == "groq":
            return bool(self.GROQ_API_KEY and self.GROQ_API_KEY != "gsk_your_api_key_here")
        return False

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields

settings = Settings()