# RAG-Powered Website Chatbot

A production-ready RAG (Retrieval Augmented Generation) system featuring a React frontend and a FastAPI/LangChain backend. 

## 🚀 Features
- **Multi-Source Ingestion**: Support for PDFs, URLs, and raw text.
- **Smart RAG Pipeline**: Uses FAISS for vector storage and OpenAI for high-quality embeddings/generation.
- **Response Modes**:
  - `human`: Conversational and beginner-friendly.
  - `technical`: Deep architectural explanation.
  - `interview`: Structured JSON output for interview prep.
- **Advanced Metadata**: Confidence scores and source tracking for every answer.
- **Auto-Summary**: Instant summary and key points generation upon upload.
- **Context Memory**: Maintains session history for follow-up questions.

## 🛠 Tech Stack
- **Backend**: Python 3.10+, FastAPI, LangChain, FAISS, OpenAI
- **Frontend**: React (JSX), Vite, Tailwind CSS

## 🏁 Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment:
   - Copy `.env.example` to `.env`.
   - Add your `OPENAI_API_KEY`.
4. Run the server:
   ```bash
   python main.py
   ```
   *The API will be available at http://localhost:8000*

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure
- `/backend` - FastAPI application logic and modular services.
- `/src` - React frontend with glassmorphic UI components.
- `/vector_db` - Local FAISS storage (generated at runtime).

