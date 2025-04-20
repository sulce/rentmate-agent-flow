from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Optional, Any
from datetime import datetime, timedelta
from bson import ObjectId
import boto3
from botocore.exceptions import ClientError
import os
import logging
from pydantic import BaseModel, Field

from app.models.agent import AgentInDB
from app.models.application import ApplicationCreate, ApplicationInDB, ApplicationUpdate, ApplicationStatus, BioInfo
from app.core.database import mongodb
from app.core.auth import get_current_agent
from app.core.config import settings
from app.core.email_notifications import send_notification

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

@router.post("/", response_model=ApplicationInDB)
async def create_application(
    application: ApplicationCreate,
    current_agent: AgentInDB = Depends(get_current_agent)
) -> Any:
    db = mongodb.get_db()
    
    # If this is a new application from a link, get the agent_id from the link
    if hasattr(application, 'link_id') and application.link_id:
        link_doc = await db.application_links.find_one({
            "link_id": application.link_id,
            "is_active": True
        })
        if not link_doc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired application link"
            )
        agent_id = link_doc["agent_id"]
    else:
        agent_id = str(current_agent.id)
    
    # Create default bio_info
    default_bio_info = BioInfo(
        first_name="",
        last_name="",
        move_in_date=datetime.utcnow()
    )
    
    # Create the application document
    application_data = {
        "agent_id": agent_id,
        "status": ApplicationStatus.DRAFT,
        "bio_info": default_bio_info.dict(),
        "orea_form": None,
        "documents": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert the application
    result = await db.applications.insert_one(application_data)
    application_data["id"] = str(result.inserted_id)
    
    return ApplicationInDB(**application_data)

@router.get("/", response_model=List[ApplicationInDB])
async def list_applications(
    status: Optional[ApplicationStatus] = None,
    current_agent: AgentInDB = Depends(get_current_agent)
) -> Any:
    db = mongodb.get_db()
    
    query = {"agent_id": str(current_agent.id)}
    if status:
        query["status"] = status
    
    applications = await db.applications.find(query).to_list(length=None)
    return [ApplicationInDB(**app) for app in applications]

@router.get("/{application_id}", response_model=ApplicationInDB)
async def get_application(
    application_id: str,
    current_agent: AgentInDB = Depends(get_current_agent)
) -> Any:
    db = mongodb.get_db()
    
    application = await db.applications.find_one({
        "_id": ObjectId(application_id),
        "agent_id": str(current_agent.id)
    })
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return ApplicationInDB(**application)

@router.put("/{application_id}", response_model=ApplicationInDB)
async def update_application(
    application_id: str,
    application_update: ApplicationUpdate,
    current_agent: AgentInDB = Depends(get_current_agent)
) -> Any:
    db = mongodb.get_db()
    
    update_data = application_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.applications.update_one(
        {"_id": ObjectId(application_id), "agent_id": str(current_agent.id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    updated_application = await db.applications.find_one({
        "_id": ObjectId(application_id)
    })
    return ApplicationInDB(**updated_application)

@router.post("/{application_id}/documents")
async def upload_document(
    application_id: str,
    file: UploadFile = File(...),
    document_type: str = None,
    current_agent: AgentInDB = Depends(get_current_agent)
):
    db = mongodb.get_db()
    
    # Get the application
    application = await db.applications.find_one({
        "_id": application_id,
        "agent_id": str(current_agent.id)
    })
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    try:
        # Generate a unique filename
        file_extension = file.filename.split('.')[-1]
        filename = f"documents/{application_id}/{datetime.utcnow().timestamp()}.{file_extension}"
        
        # Upload to S3
        s3_client.upload_fileobj(
            file.file,
            settings.AWS_BUCKET_NAME,
            filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        
        # Generate the public URL
        document_url = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
        
        # Update application with document info
        update_data = {
            "document_url": document_url,
            "document_uploaded_at": datetime.utcnow(),
            "status": ApplicationStatus.IN_REVIEW
        }
        if document_type:
            update_data["document_type"] = document_type
            
        await db.applications.update_one(
            {"_id": application_id},
            {"$set": update_data}
        )
        
        # Send notification to agent
        await send_notification(
            current_agent,
            Application(**application),
            document_type or "Unknown"
        )
        
        return {"document_url": document_url}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")
    finally:
        file.file.close()

@router.post("/generate-link", response_model=dict)
async def generate_application_link(
    current_agent: AgentInDB = Depends(get_current_agent)
) -> Any:
    db = mongodb.get_db()
    
    # Generate a unique link ID
    link_id = str(ObjectId())
    
    # Create the application link document
    link_doc = {
        "link_id": link_id,
        "agent_id": str(current_agent.id),
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

@router.get("/validate-link/{link_id}", response_model=dict)
async def validate_application_link(
    link_id: str
) -> Any:
    db = mongodb.get_db()
    
    # Find the link document
    link_doc = await db.application_links.find_one({
        "link_id": link_id,
        "is_active": True
    })
    
    if not link_doc:
        return {"isValid": False}
    
    return {"isValid": True}

class StartApplicationRequest(BaseModel):
    link_id: str

@router.post("/start", response_model=ApplicationInDB)
async def start_application(
    request: StartApplicationRequest
) -> Any:
    db = mongodb.get_db()
    
    # Validate the link
    link_doc = await db.application_links.find_one({
        "link_id": request.link_id,
        "is_active": True
    })
    if not link_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired application link"
        )
    
    # Check if agent_id exists in the link document
    if "agent_id" not in link_doc:
        # Log the issue
        logger.error(f"Missing agent_id in link document: {link_doc}")
        
        # Use a default agent ID or fail gracefully
        agent_id = str(link_doc.get("_id", ObjectId()))  # Fallback to document ID or create new
    else:
        agent_id = str(link_doc["agent_id"])
    
    # Create a new application with minimal required fields
    application_data = {
        "agent_id": agent_id,
        "status": ApplicationStatus.DRAFT,
        "bio_info": {
            "first_name": "",
            "last_name": "",
            "bio": "",
            "move_in_date": None,
            "profile_image": None,
            "prompts": {}
        },
        "documents": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.applications.insert_one(application_data)
    application_data["id"] = str(result.inserted_id)
    
    return ApplicationInDB(**application_data)