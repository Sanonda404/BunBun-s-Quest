from pydantic import BaseModel, Field
from typing import Optional, List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import json
from src.schemas.quiz import QuizResponseSchema, QuizGenerateRequest
import pypdf # Make sure pypdf is installed or use standard text extraction
from google import genai
from google.genai import types
from src.core.config import settings
from src.services.rag_services import rag_service

router = APIRouter(prefix="/api/quiz", tags=["Distraction Guard"])

@router.post("/generate", response_model=QuizResponseSchema)
async def generate_quiz(payload: QuizGenerateRequest):
    """
    Retrieves context matching the specific topic, or relies strictly on the topic 
    if no relevant chunks are found, avoiding cross-contamination from unrelated notes.
    """
    # 1. Retrieve context chunks specifically matching the requested topic
    retrieved_chunks = rag_service.search_context(payload.topic, n_results=4)
    
    # Filter chunks to ensure they actually relate or fallback cleanly
    context_text = "\n\n".join(retrieved_chunks) if retrieved_chunks else f"Core principles and fundamentals of {payload.topic}."

    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = f"""
You are Bun Bun's Quiz Engine, an expert AI tutor.
Generate EXACTLY {payload.num_questions} quiz questions of type: "{payload.question_type}" 
STRICTLY about the topic: "{payload.topic}".

Use the following reference notes if relevant, but DO NOT drift to other unrelated topics like FastAPI if the topic is Database Management Systems:
""{context_text}""

Respond in STRICT JSON format matching this schema:
{{
  "topic": "{payload.topic}",
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Exact string matching the correct option",
      "explanation": "A short, encouraging explanation from Bun Bun."
    }}
  ]
}}
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        if response.text is None:
            raise HTTPException(status_code=500, detail="No response from Gemini API.")
        quiz_data = json.loads(response.text)
        return quiz_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

import io
from pypdf import PdfReader

@router.post("/upload-pdf")
async def upload_pdf(document_id: str = Form(...), topic: str = Form(...), file: UploadFile = File(...)):
    """Extracts text from an uploaded PDF file and vectorizes it into ChromaDB."""
    try:
        contents = await file.read()
        pdf_reader = PdfReader(io.BytesIO(contents))
        extracted_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        chunks_count = rag_service.add_notes(
            document_id=document_id,
            text=extracted_text,
            metadata={"topic": topic, "filename": file.filename}
        )

        return {
            "message": "PDF uploaded and vectorized successfully!",
            "document_id": document_id,
            "chunks_created": chunks_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")