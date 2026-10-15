import uuid
from typing import List, Dict, Any

class SessionStorage:
    def __init__(self):
        self._active_topic: str = "Computer Science & Programming"
        self._inbox: List[Dict[str, Any]] = []
        self._review_bank: List[Dict[str, Any]] = []

    def get_active_topic(self) -> str:
        return self._active_topic

    def set_active_topic(self, topic: str) -> None:
        self._active_topic = topic

    def get_inbox(self) -> List[Dict[str, Any]]:
        return self._inbox

    def add_to_inbox(self, item: Dict[str, Any]) -> Dict[str, Any]:
        item_id = str(uuid.uuid4())
        entry = {
            "id": item_id,
            "url": item.get("url", ""),
            "title": item.get("title", ""),
            "saved_at": item.get("saved_at", "Just now")
        }
        self._inbox.append(entry)
        return entry

    def remove_from_inbox(self, item_id: str) -> bool:
        initial_len = len(self._inbox)
        self._inbox = [item for item in self._inbox if item.get("id") != item_id]
        return len(self._inbox) < initial_len

    # --- Review Bank Methods ---
    def get_review_bank(self) -> List[Dict[str, Any]]:
        return self._review_bank

    def add_to_review_bank(self, question_data: Dict[str, Any]) -> Dict[str, Any]:
        item_id = str(uuid.uuid4())
        entry = {
            "id": item_id,
            "question": question_data.get("question"),
            "user_answer": question_data.get("user_answer"),
            "correct_answer": question_data.get("correct_answer"),
            "explanation": question_data.get("explanation"),
            "topic": question_data.get("topic", self._active_topic)
        }
        self._review_bank.append(entry)
        return entry

    def remove_from_review_bank(self, item_id: str) -> bool:
        initial_len = len(self._review_bank)
        self._review_bank = [q for q in self._review_bank if q.get("id") != item_id]
        return len(self._review_bank) < initial_len

session_storage = SessionStorage()