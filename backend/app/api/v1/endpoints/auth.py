from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from typing import Any
from bson import ObjectId
import logging
from pydantic import BaseModel

from app.core.security import verify_password, get_password_hash, create_access_token, verify_token
from app.core.config import settings
from app.models.agent import AgentCreate, AgentInDB
from app.core.database import mongodb

logger = logging.getLogger(__name__)
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=dict)
async def register(agent: AgentCreate) -> Any:
    try:
        db = mongodb.get_db()
        
        # Check if email already exists
        if await db.agents.find_one({"email": agent.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new agent
        agent_dict = agent.dict()
        agent_dict["hashed_password"] = get_password_hash(agent.password)
        del agent_dict["password"]
        agent_dict["created_at"] = agent_dict["updated_at"] = datetime.utcnow()
        
        result = await db.agents.insert_one(agent_dict)
        agent_dict["id"] = str(result.inserted_id)
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(result.inserted_id)}, expires_delta=access_token_expires
        )
        
        return {
            "token": access_token,
            "user": {
                "id": str(result.inserted_id),
                "email": agent.email,
                "fullName": f"{agent.first_name} {agent.last_name}",
                "companyName": agent.company_name
            }
        }
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=dict)
async def login(login_data: LoginRequest) -> Any:
    try:
        db = mongodb.get_db()
        logger.info(f"Attempting login for email: {login_data.email}")
        
        agent = await db.agents.find_one({"email": login_data.email})
        if not agent:
            logger.warning(f"Login failed: Email {login_data.email} not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not verify_password(login_data.password, agent["hashed_password"]):
            logger.warning(f"Login failed: Incorrect password for email {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.info(f"Login successful for email: {login_data.email}")
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(agent["_id"])}, expires_delta=access_token_expires
        )
        
        return {
            "token": access_token,
            "user": {
                "id": str(agent["_id"]),
                "email": agent["email"],
                "fullName": f"{agent['first_name']} {agent['last_name']}",
                "companyName": agent.get("company_name")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

async def get_current_agent(token: str = Depends(oauth2_scheme)) -> AgentInDB:
    try:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        payload = verify_token(token)
        if payload is None:
            raise credentials_exception
        
        agent_id = payload.get("sub")
        if agent_id is None:
            raise credentials_exception
        
        db = mongodb.get_db()
        agent = await db.agents.find_one({"_id": ObjectId(agent_id)})
        if agent is None:
            raise credentials_exception
        
        # Convert MongoDB document to AgentInDB model
        agent_dict = {
            "id": str(agent["_id"]),
            "email": agent["email"],
            "hashed_password": agent["hashed_password"],
            "created_at": agent["created_at"],
            "updated_at": agent["updated_at"],
            "settings": agent.get("settings", {}),
            "is_active": agent.get("is_active", True),
            "is_verified": agent.get("is_verified", False)
        }
        
        return AgentInDB(**agent_dict)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token validation failed"
        ) 