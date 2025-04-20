from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class BioInfo(BaseModel):
    first_name: str
    last_name: str
    bio: Optional[str] = None
    move_in_date: Optional[datetime] = None
    profile_image: Optional[str] = None
    prompts: Optional[dict] = None

class OREAForm(BaseModel):
    form_data: dict
    signed_url: Optional[str] = None
    uploaded_url: Optional[str] = None

class Document(BaseModel):
    type: str
    url: str
    uploaded_at: datetime

class ApplicationBase(BaseModel):
    agent_id: str
    status: ApplicationStatus = ApplicationStatus.DRAFT
    bio_info: BioInfo
    orea_form: Optional[OREAForm] = None
    documents: List[Document] = []
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    link_id: Optional[str] = None

class ApplicationInDB(ApplicationBase):
    id: str
    created_at: datetime
    updated_at: datetime

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    bio_info: Optional[BioInfo] = None
    orea_form: Optional[OREAForm] = None
    documents: Optional[List[Document]] = None
    notes: Optional[str] = None 