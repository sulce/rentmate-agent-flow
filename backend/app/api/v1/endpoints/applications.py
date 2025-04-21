from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional, Any, Dict
from datetime import datetime, timedelta
from bson import ObjectId
import boto3
from botocore.exceptions import ClientError
import os
import logging
from pydantic import BaseModel, Field
import tempfile
import json
import uuid
import shutil
from fastapi.responses import FileResponse
from app.api.v1.endpoints.pdf_operations import fill_pdf_form, add_signature_to_pdf

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
    # current_agent: AgentInDB = Depends(get_current_agent)
) -> Any:
    db = mongodb.get_db()
    
    application = await db.applications.find_one({
        "_id": ObjectId(application_id),
        #"agent_id": str(current_agent.id)
    })
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
      # Ensure required fields for model validation
    if "_id" in application:
        application["id"] = str(application["_id"])
    
   # Make sure bio_info has all required fields
    if "bio_info" not in application or not application["bio_info"]:
        application["bio_info"] = {
            "first_name": "",
            "last_name": "",
            "bio": None,
            "move_in_date": None,
            "profile_image": None,
            "prompts": {}
        }
    
    # Make sure documents exist as an empty list
    if "documents" not in application or not application["documents"]:
        application["documents"] = []
    
    return ApplicationInDB(**application)


@router.put("/{application_id}", response_model=ApplicationInDB)
async def update_application(
    application_id: str,
    application_update: ApplicationUpdate
) -> Any:
    db = mongodb.get_db()
    
    update_data = application_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.applications.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": update_data}
    )
    
    updated_application = await db.applications.find_one({
        "_id": ObjectId(application_id)
    })
    
    # Add id field for Pydantic
    updated_application["id"] = str(updated_application["_id"])
    
    return ApplicationInDB(**updated_application)


@router.post("/{application_id}/documents")
async def upload_document(
    application_id: str,
    file: UploadFile = File(...),
    document_type: str = None,
    # current_agent: AgentInDB = Depends(get_current_agent)
):
    db = mongodb.get_db()
    
    # Get the application
    application = await db.applications.find_one({
        "_id": application_id,
       #  "agent_id": str(current_agent.id)
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
    
    # Generate the full URL - with the correct /apply/link/ format
    frontend_url = settings.FRONTEND_URL or "http://localhost:8080"
    application_url = f"{frontend_url}/apply/link/{link_id}"
    
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
        logger.error(f"Missing agent_id in link document: {link_doc}")
        agent_id = str(link_doc.get("_id", ObjectId()))
    else:
        agent_id = str(link_doc["agent_id"])
    
    # Create properly initialized BioInfo
    bio_info = {
        "first_name": "",
        "last_name": "",
        "bio": None,
        "move_in_date": None,
        "profile_image": None,
        "prompts": {}
    }
    
    # Create a new application with minimal required fields
    application_data = {
        "agent_id": agent_id,
        "status": ApplicationStatus.DRAFT.value,
        "bio_info": bio_info,
        "documents": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.applications.insert_one(application_data)
    application_data["id"] = str(result.inserted_id)
  
    return ApplicationInDB(**application_data)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class FormData(BaseModel):
    formData: Dict[str, Any]

@router.post("/api/generate-pdf")
async def generate_pdf(form_data: FormData):
    # Generate unique ID for this request
    file_id = str(uuid.uuid4())
    output_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    # Template path (replace with actual path to your OREA 410 template)
    template_path = "templates/OREA_Form_410.pdf"
    
    try:
        # Fill the PDF with form data
        fill_pdf_form(template_path, output_path, form_data.formData)
        
        return {"file_id": file_id, "message": "PDF generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/sign-pdf")
async def sign_pdf(
    file_id: str = Form(...),
    signature: UploadFile = File(...),
    page: int = Form(0),
    x: float = Form(...),
    y: float = Form(...)
):
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Save signature image temporarily
    sig_path = os.path.join(UPLOAD_DIR, f"{file_id}_sig.png")
    with open(sig_path, "wb") as f:
        f.write(await signature.read())
    
    signed_pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}_signed.pdf")
    
    try:
        # Add signature to PDF
        add_signature_to_pdf(pdf_path, signed_pdf_path, sig_path, page, x, y)
        
        # Clean up signature file
        os.remove(sig_path)
        
        return {"file_id": f"{file_id}_signed", "message": "PDF signed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/preview-pdf/{file_id}")
async def preview_pdf(file_id: str):
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    if not os.path.exists(pdf_path):
        pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}_signed.pdf")
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="PDF not found")
    
    return FileResponse(pdf_path, media_type="application/pdf")

@router.post("/api/upload-completed-form")
async def upload_completed_form(file: UploadFile = File(...)):

    # Generate unique ID for this upload
    file_id = str(uuid.uuid4())
    output_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    try:
        # Save uploaded file
        with open(output_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        return {"file_id": file_id, "message": "Form uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
