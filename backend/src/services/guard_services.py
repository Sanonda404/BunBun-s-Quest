import json
from google import genai
from google.genai import types
from src.core.config import settings
from src.core.storage import session_storage
from typing import Optional

def gen_prompt(current_topic: str, title: str, url: str, search_query: str | None):
    return f"""
        You are BunBun, a cozy AI study companion guard.
        The user's current study goal/topic is: "{current_topic}"

        Evaluate if the following webpage/search is RELEVANT to their study topic, or if it is a DISTRACTION.

        Page Title: "{title}"
        URL: "{url}"
        Search Query: "{search_query or 'None'}"

        Respond in STRICT JSON format with keys:
        - "is_distraction": boolean (true if off-topic/distraction, false if relevant to study)
        - "category": string ("relevant_search" or "distraction")
        - "message": string (A short, cute 1-sentence message from BunBun explaining why)
    """


class GuardService:
    @staticmethod
    def _get_gemini_client():
        if settings.GEMINI_API_KEY:
            return genai.Client(api_key=settings.GEMINI_API_KEY)
        return None

    @classmethod
    def evaluate_tab(cls, url: str, title: str = "", search_query: Optional[str] = None) -> dict:
        url_lower = url.lower()
        title_lower = title.lower()
        query_lower = (search_query or "").lower()

        # 1. Whitelist Music and Audio Streams
        music_keywords = ["spotify.com", "music.youtube.com", "soundcloud.com", "lofi", "ambient"]
        if any(kw in url_lower or kw in title_lower for kw in music_keywords):
            return {
                "is_distraction": False,
                "category": "music",
                "message": "Bun Bun approves this cozy audio stream!"
            }

        # 2. Whitelist Known Developer / Study Domains
        study_domains = ["github.com", "stackoverflow.com", "localhost", "coursera.org", "wikipedia.org", "notion.so"]
        if any(domain in url_lower for domain in study_domains):
            return {
                "is_distraction": False,
                "category": "study",
                "message": "Bun Bun sees you in the study zone!"
            }

        # 3. Gemini AI Topic Relevance Evaluation
        current_topic = session_storage.get_active_topic()
        client = cls._get_gemini_client()

        if client:
            try:
                prompt = gen_prompt(current_topic, title, url, search_query)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                
                
                if response.text is not None:
                    result = json.loads(response.text)
                else:
                    result = {}
                
                # If flagged as distraction, store it in the Look At Later inbox
                if result.get("is_distraction"):
                    session_storage.add_to_inbox({
                        "url": url,
                        "title": title or url,
                        "saved_at": "Just now"
                    })
                
                return result

            except Exception as e:
                print(f"⚠️ Gemini Evaluation Fallback due to error: {e}")

        # 4. Fallback Keyword Match (if Gemini Client unavailable or fails)
        topic_words = [w.lower() for w in current_topic.split() if len(w) > 3]
        is_relevant = any(w in title_lower or w in query_lower for w in topic_words)

        if is_relevant:
            return {
                "is_distraction": False,
                "category": "relevant_search",
                "message": f"Bun Bun checked: Matches '{current_topic}'!"
            }

        # Auto-save to inbox if flagged as distraction
        session_storage.add_to_inbox({
            "url": url,
            "title": title or url,
            "saved_at": "Just now"
        })

        return {
            "is_distraction": True,
            "category": "distraction",
            "message": "Bun Bun saved this distraction to your Look At Later inbox!"
        }