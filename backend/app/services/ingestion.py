import re
import requests
from bs4 import BeautifulSoup
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

class IngestionService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            add_start_index=True,
        )

    def clean_text(self, text: str) -> str:
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    async def process_pdf(self, file_path: str):
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        for doc in documents:
            doc.page_content = self.clean_text(doc.page_content)
        return self.text_splitter.split_documents(documents)

    async def process_url(self, url: str):
        loader = WebBaseLoader(url)
        documents = loader.load()
        for doc in documents:
            doc.page_content = self.clean_text(doc.page_content)
        return self.text_splitter.split_documents(documents)

    async def process_text(self, text: str, source_name: str = "raw_text"):
        cleaned_text = self.clean_text(text)
        docs = self.text_splitter.create_documents([cleaned_text], metadatas=[{"source": source_name}])
        return docs

ingestion_service = IngestionService()
