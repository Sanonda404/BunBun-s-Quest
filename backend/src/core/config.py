import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Bun Bun's Quest API"
    VERSION: str = "1.0.0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

settings = Settings()

if not settings.GEMINI_API_KEY:
    print("⚠️ Warning: GEMINI_API_KEY is not set in backend/.env. AI features will run in fallback mode.")

if not settings.GROQ_API_KEY:
    print("⚠️ Warning: GROQ_API_KEY is not set in backend/.env. AI features will run in fallback mode.")