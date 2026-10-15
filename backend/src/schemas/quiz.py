from pydantic import BaseModel, Field
from typing import List, Optional

class NoteUploadSchema(BaseModel):
    document_id: str = Field(..., description="Unique slug or title for the note document.")
    text: str = Field(..., description="The raw note text or lecture content.")
    topic: Optional[str] = Field(default="General Study", description="Study category.")


class QuestionSchema(BaseModel):
    question: str = Field(..., description="The multiple-choice question text.")
    options: List[str] = Field(..., description="List of 4 possible options.")
    correct_answer: str = Field(..., description="The exact correct option string.")
    explanation: str = Field(..., description="Short explanation of why the answer is correct.")

class QuizResponseSchema(BaseModel):
    topic: str
    questions: List[QuestionSchema]

class QuizGenerateRequest(BaseModel):
    topic: str = Field(..., description="The specific topic or query.")
    num_questions: int = Field(default=3, description="Number of questions.")
    question_type: str = Field(default="Multiple Choice", description="Multiple Choice, True/False, or Fill-in-the-blank.")

class ReviewBankItemSchema(BaseModel):
    question: str
    user_answer: str
    correct_answer: str
    explanation: str
    topic: str = "General Study"