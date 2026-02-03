# 🤖 RAG-Powered Website Chatbot

Hi! I'm excited to share my RAG-Powered Website Chatbot project - a production-ready system that I built to transform static documents into intelligent, conversational experiences. This project showcases my skills in full-stack development, AI integration, and modern web technologies.

## 🌟 What I Built

I created a comprehensive RAG (Retrieval-Augmented Generation) system that solves a real-world problem: making document information instantly accessible through natural conversation. Instead of spending time searching through PDFs or websites, users can simply ask questions and get intelligent, contextual answers.

**Key Features I Developed:**
- **Multi-Source Processing**: PDF files, website URLs, and raw text input
- **Dual AI Modes**: Human-friendly and Technical response styles
- **Smart Follow-up Questions**: AI-generated contextual questions for deeper exploration
- **Multi-Language Translation**: Support for 10+ languages with one-click translation
- **Source Attribution**: Shows exact document and page references for transparency
- **Real-time Analytics**: Comprehensive usage tracking and performance monitoring

## 🛠️ Technologies I Used

**Frontend:** React.js, Tailwind CSS, Vite, Lucide React
**Backend:** Python, FastAPI, Uvicorn
**AI/ML:** FAISS, LangChain, Groq API (Llama-3.1-8b), HuggingFace Transformers
**Document Processing:** PyPDF2, BeautifulSoup4, Requests

## 🚀 How to Run My Project

### Prerequisites
- Node.js (v16+), Python (v3.8+), Groq API Key (free at console.groq.com)

### Installation
```bash
# Clone repository
git clone https://github.com/HARISH112006/RAG-Powered-Website-Chatbot.git
cd RAG-Powered-Website-Chatbot

# Setup backend
cd backend
pip install -r requirements.txt
python setup_groq.py

# Setup frontend
cd ..
npm install

# Start application
# Terminal 1: cd backend && python main.py
# Terminal 2: npm run dev
```

**Access:** Frontend at `http://localhost:5173`, Backend API at `http://localhost:8000`

## 🏗️ Architecture I Designed

I built a complete RAG pipeline:
```
Document Upload → Text Extraction → Chunking → Vector Embeddings → FAISS Storage
                                                                          ↓
User Question → Question Embedding → Similarity Search → Context Retrieval
                                                                          ↓
Context + Question → LLM Processing → Answer Generation → Response Formatting
```

**Key Components:**
- **Document Processor**: Handles PDF, URL, and text extraction
- **Vector Store Service**: Manages FAISS operations and embeddings  
- **LLM Service**: Interfaces with Groq API for intelligent responses
- **Analytics Service**: Tracks usage and provides insights

## 🎯 What This Project Demonstrates

This project showcases my abilities in:
- **Full-Stack Development**: Complete React frontend and FastAPI backend
- **AI/ML Integration**: Working with FAISS, LangChain, and modern LLMs
- **System Architecture**: Designing scalable, production-ready systems
- **Problem Solving**: Building practical solutions for real-world challenges

---

**Built with passion and cutting-edge AI technologies** 🚀