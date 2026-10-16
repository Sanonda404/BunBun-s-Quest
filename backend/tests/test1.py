import asyncio
from groq import AsyncGroq
from src.core.config import settings

async def list_models():
    client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    models = await client.models.list()
    for m in models.data:
        print(f"Model ID: {m.id}")

asyncio.run(list_models())