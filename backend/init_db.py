from datetime import datetime, timedelta
from bson import ObjectId
from app.core.database import mongodb
from app.models.application import ApplicationStatus
from app.core.config import settings

async def init_db():
    # Initialize MongoDB connection
    await mongodb.connect_to_mongo()
    db = mongodb.get_db()
    
    # Create applications collection if it doesn't exist
    if "applications" not in await db.list_collection_names():
        await db.create_collection("applications")
    
    # Get an agent ID to associate with the applications
    agent = await db.agents.find_one()
    if not agent:
        print("No agents found in the database. Please create an agent first.")
        return
    
    agent_id = agent["_id"]
    
    # Create some test applications
    applications = [
        {
            "agent_id": agent_id,
            "status": ApplicationStatus.APPROVED,
            "bio_submitted_at": datetime.utcnow() - timedelta(days=7),
            "document_uploaded_at": datetime.utcnow() - timedelta(days=6),
            "created_at": datetime.utcnow() - timedelta(days=7),
            "updated_at": datetime.utcnow() - timedelta(days=6)
        },
        {
            "agent_id": agent_id,
            "status": ApplicationStatus.FORWARDED,
            "bio_submitted_at": datetime.utcnow() - timedelta(days=5),
            "document_uploaded_at": datetime.utcnow() - timedelta(days=4),
            "created_at": datetime.utcnow() - timedelta(days=5),
            "updated_at": datetime.utcnow() - timedelta(days=4)
        },
        {
            "agent_id": agent_id,
            "status": ApplicationStatus.REVIEWED,
            "bio_submitted_at": datetime.utcnow() - timedelta(days=3),
            "document_uploaded_at": datetime.utcnow() - timedelta(days=2),
            "created_at": datetime.utcnow() - timedelta(days=3),
            "updated_at": datetime.utcnow() - timedelta(days=2)
        }
    ]
    
    # Insert the test applications
    result = await db.applications.insert_many(applications)
    print(f"Inserted {len(result.inserted_ids)} test applications")
    
    # Close MongoDB connection
    await mongodb.close_mongo_connection()

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db()) 