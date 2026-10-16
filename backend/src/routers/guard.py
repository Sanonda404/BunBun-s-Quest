import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.schemas.guard import TabDataSchema, DistractionCheckResponse, TopicUpdateSchema, InboxItemSchema
from src.services.guard_services import GuardService
from src.core.storage import session_storage

router = APIRouter(prefix="/api", tags=["Distraction Guard"])



@router.post("/guard/check-distraction", response_model=DistractionCheckResponse)
async def check_distraction(tab: TabDataSchema):
    """
    Evaluates a tab against active study topic using Gemini AI + whitelists.
    Auto-saves distractions to the Look At Later inbox.
    """
    is_focus_active = session_storage._is_focus_active
    return await GuardService.evaluate_tab(
        url=tab.url,
        title=tab.title,
        search_query=tab.search_query,
        is_focus_active=is_focus_active
    )

@router.get("/inbox")
async def get_inbox():
    """Returns all saved items in the Look At Later inbox."""
    return {"inbox": session_storage.get_inbox()}

@router.post("/inbox")
async def add_to_inbox(item: InboxItemSchema):
    """Adds a newly flagged distraction page to the Look At Later inbox."""
    new_item = {
        "url": item.url,
        "title": item.title or item.url,
        "saved_at": item.saved_at
    }
    session_storage.add_to_inbox(new_item)
    return {"message": "Saved to inbox successfully!", "item": new_item}

@router.delete("/inbox/{item_id}")
async def remove_from_inbox(item_id: str):
    """Deletes an item from the inbox once reviewed."""
    session_storage.remove_from_inbox(item_id)
    return {"message": "Item removed from inbox"}

@router.get("/topic")
async def get_active_topic():
    """Gets the active study topic."""
    return {"topic": session_storage.get_active_topic()}

@router.post("/topic")
async def update_active_topic(payload: TopicUpdateSchema):
    """Updates the current study topic for Gemini guard evaluations."""
    session_storage.set_active_topic(payload.topic)
    return {"message": "Topic updated successfully", "active_topic": session_storage.get_active_topic()}