import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from src.services.rag_services import rag_service

def test_rag_pipeline():
    # 1. Ingest sample study notes
    sample_notes = """
    FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+.
    Pydantic is used for data validation, enforcing types at runtime and providing user-friendly errors.
    Dependency Injection in FastAPI allows building reusable components and managing database sessions cleanly.
    """
    
    chunks_added = rag_service.add_notes("intro_to_fastapi", sample_notes, {"topic": "FastAPI"})
    print(f"✅ Successfully added {chunks_added} chunks to ChromaDB vector store.")

    # 2. Query the vector store
    query = "How does validation work in FastAPI?"
    results = rag_service.search_context(query, n_results=2)
    
    print(f"\n🔍 Query: '{query}'")
    print("📌 Retrieved Context Chunks:")
    for i, doc in enumerate(results, 1):
        print(f"   {i}. {doc}")

if __name__ == "__main__":
    test_rag_pipeline()