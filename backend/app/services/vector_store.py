import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.core.config import settings

class VectorStoreService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=settings.OPENAI_API_KEY,
            model=settings.EMBEDDING_MODEL
        )
        self.vector_db = None
        self._load_or_create_db()

    def _load_or_create_db(self):
        if os.path.exists(settings.VECTOR_STORE_PATH):
            try:
                self.vector_db = FAISS.load_local(
                    settings.VECTOR_STORE_PATH, 
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
            except Exception:
                self.vector_db = None

    async def add_documents(self, documents):
        if self.vector_db is None:
            self.vector_db = FAISS.from_documents(documents, self.embeddings)
        else:
            self.vector_db.add_documents(documents)
        
        self.vector_db.save_local(settings.VECTOR_STORE_PATH)

    def similarity_search(self, query: str, k: int = 4):
        if self.vector_db is None:
            return []
        # Return both documents and scores
        return self.vector_db.similarity_search_with_relevance_scores(query, k=k)

vector_store_service = VectorStoreService()
