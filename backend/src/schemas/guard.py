from pydantic import BaseModel, Field
from typing import Optional

class TabDataSchema(BaseModel):
    url: str = Field(..., description="The full URL of the active tab being evaluated.")
    title: str = Field(default="", description="The title of the active tab or webpage.")
    search_query: Optional[str] = Field(default=None, description="Optional search terms entered by the user.")

class DistractionCheckResponse(BaseModel):
    is_distraction: bool = Field(..., description="True if the page is off-topic or sidetracking.")
    category: str = Field(..., description="Category label (e.g. 'music', 'study', 'relevant_search', 'distraction').")
    message: str = Field(..., description="Bun Bun's friendly explanation or status note.")

class TopicUpdateSchema(BaseModel):
    topic: str