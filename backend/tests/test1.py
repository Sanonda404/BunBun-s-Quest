from src.schemas.guard import TabDataSchema, DistractionCheckResponse

tab = TabDataSchema(url="https://youtube.com", title="Cat Videos")
print("Parsed Tab:", tab.model_dump())