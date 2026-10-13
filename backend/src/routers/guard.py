import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.schemas.guard import TabDataSchema, DistractionCheckResponse, TopicUpdateSchema
from src.services.guard_services import GuardService
from src.core.storage import session_storage

router = APIRouter(prefix="/api", tags=["Distraction Guard"])



@router.post("/check-distraction", response_model=DistractionCheckResponse)
async def check_distraction(tab: TabDataSchema):
    """
    Evaluates a tab against active study topic using Gemini AI + whitelists.
    Auto-saves distractions to the Look At Later inbox.
    """
    return GuardService.evaluate_tab(
        url=tab.url,
        title=tab.title,
        search_query=tab.search_query
    )

@router.get("/inbox")
async def get_inbox():
    """Fetches all items saved in the Look At Later inbox."""
    return {"inbox": session_storage.get_inbox()}

@router.delete("/inbox/{item_id}")
async def remove_inbox_item(item_id: str):
    """Removes a specific item from the Look At Later inbox."""
    removed = session_storage.remove_from_inbox(item_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Item not found in inbox")
    return {"message": "Item removed from inbox", "inbox": session_storage.get_inbox()}

@router.get("/topic")
async def get_active_topic():
    """Gets the active study topic."""
    return {"topic": session_storage.get_active_topic()}

@router.post("/topic")
async def update_active_topic(payload: TopicUpdateSchema):
    """Updates the current study topic for Gemini guard evaluations."""
    session_storage.set_active_topic(payload.topic)
    return {"message": "Topic updated successfully", "active_topic": session_storage.get_active_topic()}