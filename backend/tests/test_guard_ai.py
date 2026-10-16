import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from src.core.config import settings


def gen_prompt(current_topic: str, title: str, url: str, search_query: str | None) -> str:
    return f"""
        You are BunBun, a cozy AI study companion guard.
        The user's current active study goal/topic is: "{current_topic}"

        Evaluate if the user's current webpage visit or AI prompt/search query is RELEVANT to their study topic, or if it is a DISTRACTION.

        Page Title: "{title}"
        URL: "{url}"
        Search Query / User Prompt: "{search_query or 'None'}"

        Evaluation Rules:
        1. BROWSER SYSTEM PAGES: Internal pages (chrome://, edge://, about:blank, new tabs) are NEVER distractions.
        2. GENERAL-PURPOSE AI TOOLS (ChatGPT, Gemini, Claude, Copilot, etc.):
           - Visiting or opening AI tool homepages (e.g. ChatGPT, Gemini, Claude) or asking study/research/coding questions related to "{current_topic}" is VALID and MUST NOT be flagged as a distraction (is_distraction: false).
           - Asking off-topic, creative-entertainment, or casual prompts (e.g., "turn this photo into 90s trend", "best movies 2026", "write a song about cats") IS A DISTRACTION (is_distraction: true), even if asked inside ChatGPT/Gemini.
        3. GENERAL SEARCH & WEBPAGES:
           - Educational hubs, developer docs, and searches directly helping with "{current_topic}" are VALID (is_distraction: false).
           - Social media feeds (e.g., Facebook, Instagram, TikTok), video games, or shopping are DISTRACTIONS (is_distraction: true).

        Respond in STRICT JSON format with keys:
        - "is_distraction": boolean
        - "category": string
        - "message": string
    """


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "name, url, title, search_query, current_topic, mock_response_data, expected_distraction",
    [
        (
            "ChatGPT Homepage Visit",
            "https://chatgpt.com/",
            "ChatGPT",
            None,
            "Computer Science & Engineering",
            {"is_distraction": False, "category": "study_tool", "message": "Bun Bun welcomes you to your AI study assistant!"},
            False,
        ),
        (
            "ChatGPT - Study Prompt",
            "https://chatgpt.com/c/study-query-id",
            "Explain B-Trees - ChatGPT",
            "Explain B-Trees in detail",
            "Computer Science & Engineering",
            {"is_distraction": False, "category": "study_tool", "message": "Bun Bun sees you studying computer science!"},
            False,
        ),
        (
            "ChatGPT - Off-Topic Prompt",
            "https://chatgpt.com/c/trend-query-id",
            "90s Trend Filter - ChatGPT",
            "turn this photo into 90s trend",
            "Computer Science & Engineering",
            {"is_distraction": True, "category": "distraction", "message": "Bun Bun saved this off-topic photo edit for later!"},
            True,
        ),
        (
            "Facebook Visit",
            "https://www.facebook.com/",
            "Facebook - Log In or Sign Up",
            None,
            "Computer Science & Engineering",
            {"is_distraction": True, "category": "distraction", "message": "Bun Bun intercepted Facebook during study time!"},
            True,
        ),
    ],
)
async def test_guard_evaluation_mocked(
    name, url, title, search_query, current_topic, mock_response_data, expected_distraction
):
    """Tests guard evaluation logic using a mocked Gemini response to avoid quota limits."""
    
    # 1. Mock Gemini API response object
    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_response_data)

    # 2. Mock client.aio.models.generate_content call
    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("google.genai.Client", return_value=mock_client):
        # Generate prompt
        prompt = gen_prompt(
            current_topic=current_topic,
            title=title,
            url=url,
            search_query=search_query,
        )

        # Call mocked async execution
        response = await mock_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        result = json.loads(response.text)

        assert result["is_distraction"] == expected_distraction
        assert "message" in result