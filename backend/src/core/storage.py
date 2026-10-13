from typing import List, Dict, Any

class SessionStorage:
    def __init__(self):
        # Default study topic; can be changed by the user in the frontend
        self.active_topic: str = "Computer Science & Programming"
        
        # Inbox store for intercepted distraction URLs
        # Each entry structure: {"id": str, "url": str, "title": str, "saved_at": str}
        self.inbox: List[Dict[str, Any]] = []

    def set_active_topic(self, topic: str):
        self.active_topic = topic.strip()

    def get_active_topic(self) -> str:
        return self.active_topic

    def add_to_inbox(self, item: Dict[str, Any]):
        self.inbox.append(item)

    def get_inbox(self) -> List[Dict[str, Any]]:
        return self.inbox

    def remove_from_inbox(self, item_id: str) -> bool:
        initial_length = len(self.inbox)
        self.inbox = [item for item in self.inbox if item.get("id") != item_id]
        return len(self.inbox) < initial_length

# Instantiate shared singleton instance
session_storage = SessionStorage()