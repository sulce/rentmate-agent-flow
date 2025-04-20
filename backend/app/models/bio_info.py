from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BioInfo(BaseModel):
    first_name: str
    last_name: str
    bio: Optional[str] = None
    move_in_date: Optional[datetime] = None
    profile_image: Optional[str] = None
    prompts: Optional[dict] = None 