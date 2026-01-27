import os
import uuid
import requests
from typing import List, Optional
from PyPDF2 import PdfReader
from bs4 import BeautifulSoup
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config import settings
class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    def process_pdf(self, file_path: str) -> List[Document]:
        """Extract text from PDF and create document chunks"""
        try:
            documents = []
            with open(file_path, 'rb') as file:
                pdf_reader = PdfReader(file)
                for page_num, page in enumerate(pdf_reader.pages):
                    text = page.extract_text()
                    if text.strip():
                        cleaned_text = self._clean_text(text)
                        if len(cleaned_text) > 50:
                            doc = Document(
                                page_content=cleaned_text,
                                metadata={
                                    "source": os.path.basename(file_path),
                                    "page": page_num + 1,
                                    "type": "pdf"
                                }
                            )
                            documents.append(doc)
            if not documents:
                raise ValueError("No readable content found in PDF")
            chunked_docs = self.text_splitter.split_documents(documents)
            print(f"✅ Processed PDF: {len(documents)} pages -> {len(chunked_docs)} chunks")
            return chunked_docs
        except Exception as e:
            print(f"❌ Error processing PDF: {e}")
            raise ValueError(f"Failed to process PDF: {str(e)}")
    def process_url(self, url: str) -> List[Document]:
        """Extract content from website URL"""
        try:
            if not self._is_valid_url(url):
                raise ValueError("Invalid URL format. Please use a complete URL like https://example.com")
            print(f"🌐 Fetching content from: {url}")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    response = requests.get(url, headers=headers, timeout=30, allow_redirects=True)
                    response.raise_for_status()
                    break
                except requests.RequestException as e:
                    if attempt == max_retries - 1:
                        raise e
                    print(f"⚠️ Attempt {attempt + 1} failed, retrying...")
            content_type = response.headers.get('content-type', '').lower()
            if 'text/html' not in content_type and 'text/plain' not in content_type:
                raise ValueError(f"Unsupported content type: {content_type}. Only HTML and text content is supported.")
            soup = BeautifulSoup(response.content, 'html.parser')
            title = "Unknown"
            if soup.title and soup.title.string:
                title = soup.title.string.strip()
            for element in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "iframe"]):
                element.decompose()
            main_content = None
            for selector in ['main', 'article', '.content', '#content', '.post', '.entry']:
                main_content = soup.select_one(selector)
                if main_content:
                    break
            if not main_content:
                main_content = soup.find('body') or soup
            text = main_content.get_text(separator=' ', strip=True)
            cleaned_text = self._clean_text(text)
            if len(cleaned_text) < 100:
                raise ValueError(f"Insufficient content extracted from URL. Only {len(cleaned_text)} characters found. The page might be empty, require JavaScript, or be behind authentication.")
            doc = Document(
                page_content=cleaned_text,
                metadata={
                    "source": url,
                    "title": title,
                    "type": "web",
                    "content_length": len(cleaned_text)
                }
            )
            chunked_docs = self.text_splitter.split_documents([doc])
            print(f"✅ Processed URL: {len(cleaned_text)} chars -> {len(chunked_docs)} chunks from {url}")
            return chunked_docs
        except requests.exceptions.Timeout:
            raise ValueError("Request timed out. The website took too long to respond.")
        except requests.exceptions.ConnectionError:
            raise ValueError("Connection failed. Please check the URL and your internet connection.")
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                raise ValueError("Access forbidden. The website blocks automated requests.")
            elif e.response.status_code == 404:
                raise ValueError("Page not found. Please check the URL.")
            else:
                raise ValueError(f"HTTP error {e.response.status_code}: {e.response.reason}")
        except requests.RequestException as e:
            raise ValueError(f"Failed to fetch URL: {str(e)}")
        except Exception as e:
            print(f"❌ Error processing URL: {e}")
            raise ValueError(f"Failed to process URL: {str(e)}")
    def process_text(self, text: str, source_name: str = "raw_text") -> List[Document]:
        """Process raw text input"""
        try:
            if not text or len(text.strip()) < 10:
                raise ValueError("Text content is too short")
            cleaned_text = self._clean_text(text)
            doc = Document(
                page_content=cleaned_text,
                metadata={
                    "source": source_name,
                    "type": "text",
                    "length": len(cleaned_text)
                }
            )
            chunked_docs = self.text_splitter.split_documents([doc])
            print(f"✅ Processed text: {len(cleaned_text)} chars -> {len(chunked_docs)} chunks")
            return chunked_docs
        except Exception as e:
            print(f"❌ Error processing text: {e}")
            raise ValueError(f"Failed to process text: {str(e)}")
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        import re
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)\[\]\"\'\/]', '', text)
        return text.strip()
    def _is_valid_url(self, url: str) -> bool:
        """Validate URL format"""
        from urllib.parse import urlparse
        try:
            if not url or not isinstance(url, str):
                return False
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            result = urlparse(url)
            return all([
                result.scheme in ['http', 'https'],
                result.netloc,
                '.' in result.netloc
            ])
        except:
            return False
    def save_uploaded_file(self, file_content: bytes, filename: str) -> str:
        """Save uploaded file and return path"""
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(filename)[1]
        safe_filename = f"{file_id}_{filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        with open(file_path, 'wb') as f:
            f.write(file_content)
        return file_path
document_processor = DocumentProcessor()
