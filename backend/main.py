import os
import time
import uuid
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from models import QueryRequest, QueryResponse, UploadResponse, HealthResponse, AnalyticsResponse
from services.document_processor import document_processor
from services.vector_store import vector_store_service
from services.llm_service import llm_service
from services.analytics import analytics_service

startup_time = time.time()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="A production-ready RAG-powered chatbot backend with document ingestion and intelligent question answering"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print(f"🚀 Starting {settings.APP_NAME} v{settings.VERSION}")
    print(f"📊 LLM Provider: {settings.LLM_PROVIDER}")
    print(f"🔑 LLM Configured: {settings.is_llm_configured}")
    print(f"📁 Vector Store: {settings.VECTOR_STORE_PATH}")
    print(f"📄 Document Count: {vector_store_service.get_document_count()}")
    
    if not settings.is_llm_configured:
        print(f"⚠️  Warning: {settings.LLM_PROVIDER} API key not configured. Please set {settings.LLM_PROVIDER.upper()}_API_KEY in .env file")

async def validate_file_size(file: UploadFile = File(...)):
    """Validate uploaded file size"""
    if file.size and file.size > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB"
        )
    return file

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.VERSION,
        "status": "running",
        "endpoints": {
            "upload": "POST /upload - Upload PDF files or process URLs/text",
            "query": "POST /query - Ask questions about uploaded documents",
            "health": "GET /health - Check system health",
            "analytics": "GET /analytics - Get usage analytics",
            "docs": "/docs - API documentation"
        }
    }

@app.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    text: Optional[str] = Form(None)
):
    """
    Upload and process documents from multiple sources:
    - PDF files (multipart/form-data)
    - Website URLs 
    - Raw text content
    """
    session_id = str(uuid.uuid4())
    
    try:
        sources_provided = sum([bool(file), bool(url), bool(text)])
        if sources_provided == 0:
            raise HTTPException(400, "No source provided. Please provide a file, URL, or text content.")
        elif sources_provided > 1:
            raise HTTPException(400, "Multiple sources provided. Please provide only one source.")

        documents = []
        source_info = ""
        file_size = 0

        if file:
            if not file.filename or not file.filename.lower().endswith('.pdf'):
                raise HTTPException(400, "Only PDF files are supported for file uploads")
            
            if file.size and file.size > settings.max_file_size_bytes:
                raise HTTPException(413, f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB")
            
            file_content = await file.read()
            file_size = len(file_content)
            file_path = document_processor.save_uploaded_file(file_content, file.filename)
            
            try:
                documents = document_processor.process_pdf(file_path)
                source_info = f"PDF: {file.filename}"
            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)
        
        elif url:
            normalized_url = url.strip()
            if not normalized_url.startswith(('http://', 'https://')):
                normalized_url = 'https://' + normalized_url
            
            documents = document_processor.process_url(normalized_url)
            source_info = f"URL: {normalized_url}"
            file_size = len(normalized_url.encode())
        
        elif text:
            documents = document_processor.process_text(text, f"text_input_{session_id}")
            source_info = f"Text: {len(text)} characters"
            file_size = len(text.encode())

        if not documents:
            raise HTTPException(400, "Failed to extract content from the provided source")

        chunks_created = vector_store_service.add_documents(documents, replace_existing=True)

        summary = llm_service.generate_summary(documents)

        filename = file.filename if file else (url if url else "text_input")
        analytics_service.log_upload(filename, file_size, chunks_created, session_id)

        print(f"✅ Successfully processed {source_info} -> {chunks_created} chunks")

        return UploadResponse(
            status="success",
            message="Document processed successfully",
            document_id=session_id,
            chunks_created=chunks_created,
            summary=summary
        )

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Processing failed: {str(e)}"
        print(f"❌ Error processing upload: {e}")
        
        analytics_service.log_error("upload_error", str(e), {"source_info": source_info}, session_id)
        
        raise HTTPException(500, error_msg)

@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Ask questions about uploaded documents using RAG.
    
    Supports:
    - Multi-language responses
    - Short/full answer toggle
    - Confidence scoring
    - Source attribution
    """
    session_id = str(uuid.uuid4())
    
    try:
        if not settings.is_llm_configured:
            raise HTTPException(503, f"{settings.LLM_PROVIDER} API key not configured. Please check your environment variables.")
        
        if vector_store_service.get_document_count() == 0:
            raise HTTPException(400, "No documents available. Please upload documents first using the /upload endpoint.")

        print(f"🔍 Processing query: {request.question[:50]}... (language: {request.language})")

        context_docs = vector_store_service.similarity_search(request.question)

        response = llm_service.generate_answer(
            question=request.question,
            context_docs=context_docs,
            mode=request.mode,
            language=request.language,
            short_answer=request.short_answer
        )

        followup_questions = llm_service.generate_followup_questions(
            question=request.question,
            answer=response.answer
        )
        
        response.followup_questions = followup_questions

        analytics_service.log_query(
            question=request.question,
            answer_length=len(response.answer),
            confidence_score=response.confidence_score or 0.0,
            processing_time_ms=response.processing_time_ms or 0,
            language=request.language,
            session_id=session_id
        )

        print(f"✅ Query processed in {response.processing_time_ms}ms (confidence: {response.confidence_score})")
        return response

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Query processing failed: {str(e)}"
        print(f"❌ Error processing query: {e}")
        
        analytics_service.log_error("query_error", str(e), {"question": request.question}, session_id)
        
        raise HTTPException(500, error_msg)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Comprehensive health check endpoint.
    
    Returns system status including:
    - OpenAI connection status
    - Vector store status
    - Document count
    - System uptime
    """
    try:
        uptime_seconds = time.time() - startup_time
        doc_count = vector_store_service.get_document_count()
        vector_status = vector_store_service.get_status()
        
        is_healthy = settings.is_llm_configured and vector_status != "error"
        
        return HealthResponse(
            status="healthy" if is_healthy else "degraded",
            message="System operational" if is_healthy else "System has issues",
            llm_configured=settings.is_llm_configured,
            llm_provider=settings.LLM_PROVIDER,
            total_documents=doc_count,
            uptime_seconds=round(uptime_seconds, 2)
        )
        
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return HealthResponse(
            status="error",
            message=f"Health check failed: {str(e)}",
            llm_configured=False,
            llm_provider=settings.LLM_PROVIDER,
            total_documents=0,
            uptime_seconds=0
        )

@app.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    """Get usage analytics and statistics"""
    try:
        return analytics_service.get_analytics()
    except Exception as e:
        print(f"❌ Error getting analytics: {e}")
        raise HTTPException(500, f"Failed to get analytics: {str(e)}")

@app.get("/stats")
async def get_system_stats():
    """Get detailed system statistics"""
    return {
        "total_documents": vector_store_service.get_document_count(),
        "vector_store_status": vector_store_service.get_status(),
        "llm_configured": settings.is_llm_configured,
        "llm_provider": settings.LLM_PROVIDER,
        "chunk_size": settings.CHUNK_SIZE,
        "chunk_overlap": settings.CHUNK_OVERLAP,
        "top_k_results": settings.TOP_K_RESULTS,
        "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
        "uptime_seconds": round(time.time() - startup_time, 2)
    }

@app.delete("/clear")
async def clear_database():
    """Clear all documents and analytics (use with caution)"""
    try:
        vector_store_service.clear_store()
        analytics_service.clear_analytics()
        return {"message": "Database and analytics cleared successfully"}
    except Exception as e:
        raise HTTPException(500, f"Failed to clear database: {str(e)}")

@app.get("/export")
async def export_analytics():
    """Export all analytics data"""
    try:
        return analytics_service.export_analytics()
    except Exception as e:
        raise HTTPException(500, f"Failed to export analytics: {str(e)}")

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"error": "Validation Error", "detail": str(exc)}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"❌ Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": "An unexpected error occurred"}
    )

if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting {settings.APP_NAME} on http://localhost:8000")
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )