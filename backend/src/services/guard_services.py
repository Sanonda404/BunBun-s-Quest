import json
import logging
from typing import Optional
from google import genai
from google.genai import types
from src.core.config import settings

logger = logging.getLogger("bunbun.guard_service")

# In-memory cache to prevent redundant API calls
_EVAL_CACHE = {}

SYSTEM_PREFIXES = (
    "chrome://", "edge://", "about:", "chrome-extension://", 
    "brave://", "http://localhost", "http://127.0.0.1", "https://localhost"
)

KNOWN_DISTRACTION_DOMAINS = [
    "facebook.com", "instagram.com", "tiktok.com", 
    "twitter.com", "x.com", "reddit.com", "netflix.com", "twitch.tv"
]

KNOWN_MUSIC_DOMAINS = [
    "open.spotify.com", "music.apple.com", "soundcloud.com", "pandora.com"
]

bunbun_schema = {
    "name": "bunbun_verdict",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "is_distraction": {
                "type": "boolean",
                "description": "true if distraction, false if study/acceptable background"
            },
            "category": {
                "type": "string",
                "enum": ["study_resource", "study_music", "ai_tool", "system_page", "distraction"],
                "description": "The category classification of the activity"
            },
            "message": {
                "type": "string",
                "description": "A short, cute 1-sentence message from BunBun explaining the verdict"
            }
        },
        "required": ["is_distraction", "category", "message"],
        "additionalProperties": False
    }
}

class GuardService:
    @classmethod
    async def evaluate_tab(
        cls,
        url: str,
        title: str = "",
        search_query: Optional[str] = None,
        current_topic: str = "Computer Science & Engineering",
        is_focus_active: bool = True,
    ) -> dict:
        
        # RULE 1: If Focus Mode is disabled by the user (Break Time), allow everything!
        if not is_focus_active:
            return {
                "is_distraction": False,
                "category": "break_time",
                "message": "Focus mode is off. Enjoy your break!"
            }

        url_lower = url.lower()

        # RULE 2: System & Dev Pages (0 API calls)
        if any(url_lower.startswith(prefix) for prefix in SYSTEM_PREFIXES):
            return {"is_distraction": False, "category": "system_page", "message": "System page allowed."}

        # RULE 3: Music Platforms (0 API calls)
        if any(domain in url_lower for domain in KNOWN_MUSIC_DOMAINS):
            return {"is_distraction": False, "category": "study_music", "message": "Enjoy your focus music!"}

        # RULE 4: Known Social Media (0 API calls)
        if any(domain in url_lower for domain in KNOWN_DISTRACTION_DOMAINS):
            return {"is_distraction": True, "category": "distraction", "message": f"Bun Bun saved {url} to your inbox!"}

        # Check Cache to prevent duplicate queries and rate limits
        cache_key = f"{url_lower}:{title.lower()}:{str(search_query).lower()}"
        if cache_key in _EVAL_CACHE:
            return _EVAL_CACHE[cache_key]

        # Build Prompt
        prompt = f"""
        You are BunBun, a cozy AI study companion guard.
        The user's current active study topic/goal is: "{current_topic}"

        Evaluate whether the current webpage visit or search query is RELEVANT to their study topic or acceptable study ambient background, or if it is an UNRELATED DISTRACTION.

        Page Title: "{title}"
        URL: "{url}"
        Search Query / Prompt Context: "{search_query or 'None'}"

        CRITICAL EVALUATION RULES:

        1. BROWSER SYSTEM PAGES:
        - Internal browser pages (chrome://, edge://, about:blank, new tabs) are ALWAYS allowed (is_distraction: false).

        2. YOUTUBE & MEDIA (SPECIFIC EVALUATION):
        - Educational lectures, programming tutorials, study topics related to "{current_topic}", and music (e.g., "lofi hip hop", "study beats", "rain sounds for focus", "ambient music", songs like "Perfect" etc) are VALID study activities (is_distraction: false).
        - Entertainment videos, vlogs, movie trailers, gaming walkthroughs, trending shorts, or news unrelated to "{current_topic}" are DISTRACTIONS (is_distraction: true).

        3. GENERAL-PURPOSE AI TOOLS (ChatGPT, Gemini, Claude, Copilot etc):
        - Visiting AI tool homepages or asking questions helping with "{current_topic}" is VALID (is_distraction: false).
        - Creative entertainment prompts (e.g., "write a song about cats", "90s filter") are DISTRACTIONS (is_distraction: true).

        4. GENERAL WEBPAGES & SOCIAL MEDIA:
        - Developer docs, academic journals, StackOverflow, research sites are VALID (is_distraction: false).
        - Feeds on social networking platforms (Facebook, Instagram, TikTok, Reddit entertainment, X/Twitter, online shopping) are DISTRACTIONS (is_distraction: true).

        Respond strictly in JSON format with keys:
        - "is_distraction": boolean (true if distraction, false if study/acceptable background)
        - "category": string ("study_resource", "study_music", "ai_tool", "system_page", or "distraction")
        - "message": string (A short, cute 1-sentence message from BunBun explaining the verdict)
        """

        # PRIMARY TRY: Gemini 2.5 Flash
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    max_output_tokens=100,
                    temperature=0.1,
                ),
            )
            if not response.text:
                raise ValueError("Gemini returned an empty response.")
            result = json.loads(response.text)
            _EVAL_CACHE[cache_key] = result
            return result

        except Exception as gemini_err:
            logger.warning(f"Gemini evaluation failed ({gemini_err}). Falling back to Groq...")

        # FALLBACK TRY: Groq (`openai/gpt-oss-20b`) with local parsing
        if getattr(settings, "GROQ_API_KEY", None):
            try:
                from groq import AsyncGroq
                groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
                
                formatted_prompt = f"{prompt}\n\nRespond with ONLY a raw JSON object containing keys: 'is_distraction', 'category', and 'message'."
                
                response = await groq_client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[{"role": "user", "content": formatted_prompt}],
                    temperature=0.1,
                    max_tokens=150,
                )
                if not response.choices or not response.choices[0].message.content:
                    raise ValueError("Groq returned an empty response.")
                raw_text = response.choices[0].message.content.strip()
                if raw_text.startswith("```"):
                    raw_text = raw_text.split("```")[1]
                    if raw_text.startswith("json"):
                        raw_text = raw_text[4:].strip()
                
                result = json.loads(raw_text)
                _EVAL_CACHE[cache_key] = result
                return result

            except Exception as groq_err:
                logger.error(f"Groq fallback evaluation also failed: {groq_err}")

        # SAFE FAIL-SAFE (If both providers fail)
        return {
            "is_distraction": False,
            "category": "fallback",
            "message": "Bun Bun is resting briefly (AI Offline). Keep studying!"
        }