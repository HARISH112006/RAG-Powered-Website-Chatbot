import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.schemas import UploadRequest, UploadResponse, QueryRequest, QueryResponse, HealthResponse
from app.services.ingestion import ingestion_service
from app.services.vector_store import vector_store_service
from app.services.generation import generation_service

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", response_model=UploadResponse)
async def upload_document(
    url_request: Optional[UploadRequest] = None,
    file: Optional[UploadFile] = File(None)
):
    try:
        documents = []
        doc_id = str(uuid.uuid4())

        if file:
            # Save PDF temporarily
            temp_path = f"temp_{doc_id}_{file.filename}"
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            documents = await ingestion_service.process_pdf(temp_path)
            os.remove(temp_path)
        
        elif url_request and url_request.url:
            documents = await ingestion_service.process_url(url_request.url)
        
        elif url_request and url_request.text:
            documents = await ingestion_service.process_text(url_request.text)
        
        else:
            raise HTTPException(status_code=400, detail="No source provided")

        if not documents:
            raise HTTPException(status_code=400, detail="Failed to process document")

        # Add to vector store
        await vector_store_service.add_documents(documents)

        # Generate summary and key points
        summary, key_points = await generation_service.generate_summary(documents)

        return {
            "document_id": doc_id,
            "summary": summary,
            "key_points": key_points
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    try:
        result = await generation_service.answer_question(request.question, request.mode)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/health", response_model=HealthResponse)
async def health_check():
    llm_ok = False
    try:
        # Quick check if API key is set
        if settings.OPENAI_API_KEY:
            llm_ok = True
    except:
        llm_ok = False
        
    return {
        "status": "up",
        "llm_connected": llm_ok
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
