import sys
from pathlib import Path

# Add backend directory to path for standalone execution
sys.path.append(str(Path(__file__).resolve().parent.parent))

from src.core.storage import session_storage
from src.services.guard_services import GuardService

def run_tests():
    # Set target topic for test run
    session_storage.set_active_topic("FastAPI and Python Backend Development")
    print(f"🎯 Active Topic: '{session_storage.get_active_topic()}'\n" + "="*60)

    test_cases = [
        {
            "name": "Case 1: Relevant Search Query",
            "url": "https://www.google.com/search?q=fastapi+pydantic+v2+validation",
            "title": "fastapi pydantic v2 validation - Google Search",
            "query": "fastapi pydantic v2 validation",
            "expected": False # Not a distraction
        },
        {
            "name": "Case 2: Relevant YouTube Tutorial",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "title": "FastAPI Full Course 2026 - Building REST APIs in Python",
            "query": None,
            "expected": False # Relevant video
        },
        {
            "name": "Case 3: Clear Distraction (Reddit Memes)",
            "url": "https://www.reddit.com/r/memes",
            "title": "r/memes - The front page of internet humor",
            "query": None,
            "expected": True # Distraction!
        },
        {
            "name": "Case 4: Ambiguous / Borderline (Gaming Wiki)",
            "url": "https://minecraft.fandom.com/wiki/Redstone",
            "title": "Redstone Circuits Wiki",
            "query": None,
            "expected": True # Distraction!
        },
        {
            "name": "Case 5: Music Stream Whitelist",
            "url": "https://open.spotify.com/playlist/37i9dQZF1DX8Ueb1C1M1O1",
            "title": "Lofi Beats to Study/Relax To",
            "query": None,
            "expected": False # Approved music
        },
        {
            "name": "Case 6: StackOverflow for python",
            "url": "https://stackoverflow.com/questions/123456/how-to-fix-cors-fastapi",
            "title": "How to fix CORS error in FastAPI? - Stack Overflow",
            "query": None,
            "expected": False # Study whitelist
        }
    ]

    for idx, tc in enumerate(test_cases, 1):
        print(f"\n🧪 {tc['name']}")
        print(f"   URL: {tc['url']}")
        print(f"   Title: {tc['title']}")
        
        result = GuardService.evaluate_tab(
            url=tc['url'], 
            title=tc['title'], 
            search_query=tc.get('query')
        )
        
        is_distraction = result.get('is_distraction')
        status_icon = "🛑 DISTRACTION" if is_distraction else "✅ STUDY RELEVANT"
        passed = (is_distraction == tc['expected'])
        
        print(f"   Result: [{status_icon}]")
        print(f"   Category: {result.get('category')}")
        print(f"   Bun Bun says: \"{result.get('message')}\"")
        print(f"   Test Status: {'PASS ✨' if passed else 'FAIL ❌'}")

if __name__ == "__main__":
    run_tests()