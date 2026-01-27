import os
import pickle
from typing import List, Tuple, Optional
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from config import settings
class VectorStoreService:
    def __init__(self):
        self.vector_store: Optional[FAISS] = None
        self.embeddings = None
        self._document_count = 0
        self._initialize_embeddings()
        self._load_existing_store()
    def _initialize_embeddings(self):
        """Initialize embeddings based on LLM provider"""
        if settings.LLM_PROVIDER == "openai" and settings.is_llm_configured:
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=settings.OPENAI_API_KEY,
                model="text-embedding-ada-002"
            )
            print("✅ OpenAI embeddings initialized")
        else:
            self.embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            print("✅ Local HuggingFace embeddings initialized")
    def _load_existing_store(self):
        """Load existing vector store if it exists"""
        if os.path.exists(settings.VECTOR_STORE_PATH):
            try:
                self.vector_store = FAISS.load_local(
                    settings.VECTOR_STORE_PATH,
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                count_file = os.path.join(settings.VECTOR_STORE_PATH, "doc_count.pkl")
                if os.path.exists(count_file):
                    with open(count_file, 'rb') as f:
                        self._document_count = pickle.load(f)
                else:
                    self._document_count = len(self.vector_store.docstore._dict) if self.vector_store else 0
                print(f"✅ Loaded existing vector store with {self._document_count} documents")
            except Exception as e:
                print(f"⚠️ Could not load existing vector store: {e}")
                self.vector_store = None
                self._document_count = 0
    def add_documents(self, documents: List[Document], replace_existing: bool = True) -> int:
        """Add documents to vector store"""
        try:
            if not documents:
                raise ValueError("No documents provided")
            if replace_existing:
                self.clear_store()
                self.vector_store = FAISS.from_documents(documents, self.embeddings)
                self._document_count = len(documents)
                print(f"🔄 Created new vector store with {len(documents)} documents (replaced existing)")
            else:
                if self.vector_store is None:
                    self.vector_store = FAISS.from_documents(documents, self.embeddings)
                    self._document_count = len(documents)
                    print(f"🆕 Created new vector store with {len(documents)} documents")
                else:
                    self.vector_store.add_documents(documents)
                    self._document_count += len(documents)
                    print(f"➕ Added {len(documents)} documents to existing store")
            self._save_store()
            return len(documents)
        except Exception as e:
            print(f"❌ Error adding documents: {e}")
            raise ValueError(f"Failed to add documents: {str(e)}")
    def similarity_search(self, query: str, k: int = None) -> List[Tuple[Document, float]]:
        """Search for similar documents with relevance scores"""
        if k is None:
            k = settings.TOP_K_RESULTS
        if self.vector_store is None:
            print("⚠️ No documents in vector store")
            return []
        try:
            results = self.vector_store.similarity_search_with_relevance_scores(query, k=k)
            print(f"🔍 Found {len(results)} similar documents for query: {query[:50]}...")
            min_threshold = 0.1
            filtered_results = [(doc, score) for doc, score in results if score >= min_threshold]
            return filtered_results
        except Exception as e:
            print(f"❌ Error during similarity search: {e}")
            return []
    def get_document_count(self) -> int:
        """Get total number of documents"""
        return self._document_count
    def get_status(self) -> str:
        """Get vector store status"""
        if self.vector_store is None:
            return "empty"
        elif self._document_count == 0:
            return "initialized"
        else:
            return "ready"
    def clear_store(self):
        """Clear all documents from vector store"""
        try:
            self.vector_store = None
            self._document_count = 0
            if os.path.exists(settings.VECTOR_STORE_PATH):
                import shutil
                shutil.rmtree(settings.VECTOR_STORE_PATH)
                print("🗑️ Vector store files deleted from disk")
            print("🗑️ Vector store cleared completely")
        except Exception as e:
            print(f"❌ Error clearing store: {e}")
            self.vector_store = None
            self._document_count = 0
    def _save_store(self):
        """Save vector store to disk"""
        try:
            os.makedirs(settings.VECTOR_STORE_PATH, exist_ok=True)
            if self.vector_store:
                self.vector_store.save_local(settings.VECTOR_STORE_PATH)
            count_file = os.path.join(settings.VECTOR_STORE_PATH, "doc_count.pkl")
            with open(count_file, 'wb') as f:
                pickle.dump(self._document_count, f)
            print(f"💾 Vector store saved to {settings.VECTOR_STORE_PATH}")
        except Exception as e:
            print(f"❌ Error saving store: {e}")
vector_store_service = VectorStoreService()
