import os
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter

class RAGService:
    def __init__(self):
        # Persistent storage directory for ChromaDB vector database
        self.persist_dir = os.path.join(os.path.dirname(__file__), "../../../chroma_db")
        
        # Initialize persistent Chroma client
        self.client = chromadb.PersistentClient(path=self.persist_dir)
        
        # Use local sentence-transformer embedding function (all-MiniLM-L6-v2 runs locally)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Get or create our study notes collection
        self.collection = self.client.get_or_create_collection(
            name="study_notes_collection",
            embedding_function=self.embedding_fn # type: ignore
        )
        
        # Text chunker for splitting large notes/PDFs into manageable paragraphs
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )

    def add_notes(self, document_id: str, text: str, metadata: Optional[Dict[str, Any]] = None) -> int:
        """Splits raw text/notes into chunks and stores them in ChromaDB with local embeddings."""
        chunks = self.text_splitter.split_text(text)
        
        if not chunks:
            return 0

        ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [metadata or {"source": document_id} for _ in chunks]

        # Upsert chunks into Chroma collection
        self.collection.upsert(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )
        
        return len(chunks)

    def search_context(self, query: str, n_results: int = 3) -> List[str]:
        """Queries the vector database for the most relevant note chunks matching the user query."""
        if self.collection.count() == 0:
            return []

        results = self.collection.query(
            query_texts=[query],
            n_results=min(n_results, self.collection.count())
        )
        
        # Flatten retrieved documents
        documents = results.get("documents", [[]])
        return documents[0] if documents else []

# Instantiate singleton RAG service
rag_service = RAGService()