from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Optional
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
import os

from app.models.agent import AgentInDB, AgentSettings
from app.core.database import mongodb
from app.api.v1.endpoints.auth import get_current_agent
from app.core.config import settings

router = APIRouter()

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

@router.get("/settings", response_model=AgentSettings)
async def get_agent_settings(
    current_agent: AgentInDB = Depends(get_current_agent)
) -> AgentSettings:
    return current_agent.settings

@router.put("/settings", response_model=AgentSettings)
async def update_agent_settings(
    settings_update: AgentSettings,
    current_agent: AgentInDB = Depends(get_current_agent)
) -> AgentSettings:
    db = mongodb.get_db()
    
    # Update agent settings
    await db.agents.update_one(
        {"_id": current_agent.id},
        {
            "$set": {
                "settings": settings_update.dict(),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return settings_update

@router.post("/settings/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_agent: AgentInDB = Depends(get_current_agent)
):
    try:
        # Generate a unique filename
        file_extension = file.filename.split('.')[-1]
        filename = f"logos/{current_agent.id}/{datetime.utcnow().timestamp()}.{file_extension}"
        
        # Upload to S3
        s3_client.upload_fileobj(
            file.file,
            settings.AWS_BUCKET_NAME,
            filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        
        # Generate the public URL
        logo_url = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
        
        # Update agent settings with the new logo URL
        db = mongodb.get_db()
        await db.agents.update_one(
            {"_id": current_agent.id},
            {
                "$set": {
                    "settings.logo_url": logo_url,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {"logo_url": logo_url}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload logo: {str(e)}")
    finally:
        file.file.close()

@router.post("/settings/background")
async def upload_background(
    file: UploadFile = File(...),
    current_agent: AgentInDB = Depends(get_current_agent)
):
    try:
        # Generate a unique filename
        file_extension = file.filename.split('.')[-1]
        filename = f"backgrounds/{current_agent.id}/{datetime.utcnow().timestamp()}.{file_extension}"
        
        # Upload to S3
        s3_client.upload_fileobj(
            file.file,
            settings.AWS_BUCKET_NAME,
            filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        
        # Generate the public URL
        background_url = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
        
        # Update agent settings with the new background URL
        db = mongodb.get_db()
        await db.agents.update_one(
            {"_id": current_agent.id},
            {
                "$set": {
                    "settings.background_image_url": background_url,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {"background_url": background_url}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload background: {str(e)}")
    finally:
        file.file.close() 