from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from bson import ObjectId

from app.models.agent import AgentInDB
from app.core.config import settings
from app.core.database import mongodb
from app.core.security import verify_token, create_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_agent(token: str = Depends(oauth2_scheme)) -> AgentInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token)
        if payload is None:
            raise credentials_exception
        
        agent_id: str = payload.get("sub")
        if agent_id is None:
            raise credentials_exception
    except Exception as e:
        raise credentials_exception
    
    db = mongodb.get_db()
    agent = await db.agents.find_one({"_id": ObjectId(agent_id)})
    if agent is None:
        raise credentials_exception
    
    agent["id"] = str(agent["_id"])
    return AgentInDB(**agent)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt 