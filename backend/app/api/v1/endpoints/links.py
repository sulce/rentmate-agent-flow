from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from typing import Any
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.database import mongodb
from app.core.config import settings

router = APIRouter()

@router.post("/generate", response_model=dict)
async def generate_link() -> Any:
    db = mongodb.get_db()
    
    # Generate a unique link ID
    link_id = str(ObjectId())
    
    # Create the link document
    link_doc = {
        "link_id": link_id,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    # Insert the link document
    await db.application_links.insert_one(link_doc)
    
    # Generate the full URL
    frontend_url = settings.FRONTEND_URL or "http://localhost:8080"
    application_url = f"{frontend_url}/apply/{link_id}"
    
    return {
        "link_id": link_id,
        "url": application_url
    }

@router.get("/validate/{link_id}", response_model=dict)
async def validate_link(link_id: str) -> Any:
    db = mongodb.get_db()
    
    # Find the link document
    link_doc = await db.application_links.find_one({
        "link_id": link_id,
        "is_active": True
    })
    
    if not link_doc:
        return {"isValid": False}
    
    return {"isValid": True} 