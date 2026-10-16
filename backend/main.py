from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import health, guard, quiz, session

app = FastAPI(title="Bun Bun's Quest API", version="1.0.0")

# Enable CORS for frontend and extension communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Router Modules
app.include_router(health.router)
app.include_router(guard.router)
app.include_router(quiz.router)
app.include_router(session.router)