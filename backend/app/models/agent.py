from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, HttpUrl
from datetime import datetime

class AgentBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    company_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    brand_colors: Optional[dict] = None
    logo_url: Optional[str] = None
    custom_questions: Optional[List[dict]] = None

class AgentCreate(AgentBase):
    password: str

class AgentSettings(BaseModel):
    brand_name: Optional[str] = Field(None, description="Custom brand name for the agent")
    logo_url: Optional[HttpUrl] = Field(None, description="URL of the agent's logo")
    brand_color: Optional[str] = Field(None, description="Primary brand color in hex format")
    background_image_url: Optional[HttpUrl] = Field(None, description="URL of the background image")
    address: Optional[str] = Field(None, description="Agent's business address")
    phone: Optional[str] = Field(None, description="Agent's contact phone number")
    email: Optional[str] = Field(None, description="Agent's contact email")
    website: Optional[HttpUrl] = Field(None, description="Agent's website URL")
    enable_notifications: bool = Field(True, description="Whether to enable notifications")
    notification_email: Optional[str] = Field(None, description="Email for receiving notifications")

class AgentInDB(BaseModel):
    id: str
    email: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    settings: AgentSettings = Field(default_factory=AgentSettings)
    is_active: bool = True
    is_verified: bool = False

class AgentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    brand_colors: Optional[dict] = None
    logo_url: Optional[str] = None
    custom_questions: Optional[List[dict]] = None 