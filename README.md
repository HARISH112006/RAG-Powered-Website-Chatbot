# 🤖 RAG-Powered Website Chatbot

Hi! I'm excited to share my RAG-Powered Website Chatbot project - a production-ready system that I built to transform static documents into intelligent, conversational experiences. This project showcases my skills in full-stack development, AI integration, and modern web technologies.

## 🌟 What I Built

I created a comprehensive RAG (Retrieval-Augmented Generation) system that solves a real-world problem: making document information instantly accessible through natural conversation. Instead of spending time searching through PDFs or websites, users can simply ask questions and get intelligent, contextual answers.

### 🔄 Multi-Source Document Processing
- **PDF Analysis**: I implemented intelligent PDF text extraction and processing
- **Website Content Extraction**: Built web scraping capabilities to analyze live web content
- **Raw Text Processing**: Added direct text input for quick document analysis

### 🧠 Smart AI Features I Developed
- **Dual Response Modes**: Created Human-friendly and Technical response styles for different audiences
- **Context-Aware Responses**: Ensured all answers are grounded in uploaded documents
- **Source Attribution**: Built transparency by showing exact document and page references
- **Confidence Scoring**: Added reliability indicators for each AI response

### 🚀 Advanced Capabilities I Added
- **Smart Follow-up Questions**: Implemented AI-generated contextual questions for deeper exploration
- **Multi-Language Translation**: Integrated support for 10+ languages with one-click translation
- **Session Memory**: Built conversation context management throughout interactions
- **Real-time Analytics**: Created comprehensive usage tracking and performance monitoring

### 🎨 User Experience I Designed
- **Clean Interface**: Designed a professional, intuitive user interface
- **Drag & Drop Upload**: Implemented seamless file upload experience
- **Real-time Feedback**: Built live status updates during document processing
- **Advanced Controls**: Added configurable settings for power users

## 🛠️ Technologies I Used

### Frontend Stack
- **React.js** - I chose React for its component-based architecture and excellent state management
- **Tailwind CSS** - Used for rapid, consistent styling and responsive design
- **Vite** - Selected for fast development and optimized builds
- **Lucide React** - Integrated for clean, consistent icons

### Backend Architecture
- **Python & FastAPI** - Built the entire backend API with FastAPI for high performance
- **Uvicorn** - Deployed with Uvicorn ASGI server for production readiness

### AI & ML Integration
- **FAISS** - Implemented Facebook's similarity search for lightning-fast vector operations
- **LangChain** - Integrated for standardized AI workflows and document processing
- **Groq API** - Connected Llama-3.1-8b model for cost-effective, high-quality responses
- **HuggingFace** - Used sentence transformers for semantic embeddings

### Document Processing Pipeline
- **PyPDF2** - Implemented for reliable PDF text extraction
- **BeautifulSoup4** - Used for intelligent web content scraping
- **Requests** - Integrated for robust HTTP web processing

## 🚀 How to Run My Project

### What You'll Need
- **Node.js** (v16+)
- **Python** (v3.8+)
- **Groq API Key** (free at console.groq.com)

### Installation Steps

1. **Clone My Repository**
   ```bash
   git clone https://github.com/HARISH112006/RAG-Powered-Website-Chatbot.git
   cd RAG-Powered-Website-Chatbot
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python setup_groq.py  # I created this script to configure your API key easily
   ```

3. **Setup Frontend**
   ```bash
   cd ..
   npm install
   ```

4. **Start the Application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   python main.py

   # Frontend (Terminal 2)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

## 📖 How to Use My System

### 1. Upload Your Documents
I designed three easy ways to add content:
- Upload PDF files with drag-and-drop
- Enter website URLs for live content analysis
- Paste raw text for immediate processing

### 2. Ask Questions Naturally
- Choose between Human (simple) or Technical (detailed) response modes
- Type questions in plain English
- Adjust retrieval settings if you want more control

### 3. Get Intelligent Answers
- Read AI responses with clear source attribution
- Check confidence scores I built for reliability
- Click follow-up questions I generate for deeper exploration
- Translate responses to your preferred language

### 4. Monitor System Usage
- Access the analytics dashboard I created
- Export interaction logs for analysis
- Monitor system health and performance

## 🏗️ Architecture I Designed

I built a complete RAG pipeline:

```
Document Upload → My Text Extraction → Intelligent Chunking → Vector Embeddings → FAISS Storage
                                                                                        ↓
User Question → Question Embedding → Similarity Search → Context Retrieval
                                                                        ↓
Context + Question → LLM Processing → Answer Generation → My Response Formatting
```

### Key Components I Developed
- **Document Processor**: Handles all file types and content extraction
- **Vector Store Service**: Manages FAISS operations and embeddings
- **LLM Service**: Interfaces with Groq API for intelligent responses
- **Analytics Service**: Tracks usage and provides insights

## 🔧 Configuration Options I Built

### Environment Setup (.env)
```env
LLM_PROVIDER=groq
GROQ_API_KEY=your_api_key_here
APP_NAME=RAG Chatbot Backend
VERSION=1.0.0
MAX_FILE_SIZE_MB=50
CHUNK_SIZE=1000
TOP_K_RESULTS=5
```

## 📊 API Endpoints I Created

- `POST /upload` - Document upload and processing
- `POST /query` - Question answering with AI
- `GET /health` - System health monitoring
- `GET /analytics` - Usage statistics
- `POST /clear` - Document store management

## 🔒 Security Features I Implemented

- **Input Validation**: Comprehensive request validation
- **File Restrictions**: Safe file format enforcement
- **Size Limits**: Configurable upload restrictions
- **CORS Protection**: Secure cross-origin handling
- **API Security**: Secure credential management

## 📈 Performance Optimizations I Made

- **Sub-millisecond Search**: FAISS enables instant similarity search
- **Async Processing**: FastAPI handles concurrent requests efficiently
- **Optimized Embeddings**: Efficient vector operations
- **Scalable Design**: Built for horizontal scaling

## 🎯 What This Project Demonstrates

This project showcases my abilities in:
- **Full-Stack Development**: Complete frontend and backend implementation
- **AI/ML Integration**: Working with cutting-edge AI technologies
- **System Architecture**: Designing scalable, maintainable systems
- **User Experience**: Creating intuitive, professional interfaces
- **Problem Solving**: Building practical solutions for real-world challenges

## 🚀 Future Enhancements I'm Planning

- Advanced document types support (Word, Excel, PowerPoint)
- Real-time collaborative features
- Enhanced analytics and reporting
- Mobile application development
- Enterprise deployment options

## 📞 Get in Touch

I'm always excited to discuss this project and explore opportunities:
- **GitHub**: [HARISH112006](https://github.com/HARISH112006)
- **Email**: [Your Email]
- **LinkedIn**: [Your LinkedIn Profile]

---

**Built with passion and cutting-edge AI technologies** 🚀

*I'm proud of this project as it demonstrates my ability to integrate complex AI systems into user-friendly applications that solve real business problems.*