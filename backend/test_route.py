import asyncio
from app.api.routes.investigations import create_investigation
from app.models.investigation import CreateInvestigation
from app.database import get_supabase

async def test():
    db = get_supabase()
    body = CreateInvestigation(
        title="Test Inv",
        description="Test Desc",
        input_type="startup_idea",
        input_data={"content": "Build an AI tool"}
    )
    try:
        res = await create_investigation(body=body, db=db)
        print("Success:", res)
    except Exception as e:
        print("Error:", type(e))
        import traceback
        traceback.print_exc()

asyncio.run(test())
