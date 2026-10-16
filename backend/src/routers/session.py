from fastapi import APIRouter
from pydantic import BaseModel, Field
from src.core.storage import session_storage

router = APIRouter(prefix="/api/session", tags=["Session & Active Topic"])

class ActiveTopicSchema(BaseModel):
    topic: str = Field(..., description="The current active study topic.")

class FocusStateRequest(BaseModel):
    is_focus_active: bool

@router.get("/active-topic")
async def get_active_topic():
    """Retrieves the current active study topic."""
    return {"active_topic": session_storage.get_active_topic()}

@router.post("/active-topic")
async def set_active_topic(payload: ActiveTopicSchema):
    """Updates the current active study topic for the session."""
    session_storage.set_active_topic(payload.topic)
    return {"message": "Active topic updated", "active_topic": payload.topic}

@router.post("/set-focus-state")
async def set_focus_state(data: FocusStateRequest):
    session_storage.set_focus_state(data.is_focus_active)
    return {"status": "success", "is_focus_active": session_storage._is_focus_active}