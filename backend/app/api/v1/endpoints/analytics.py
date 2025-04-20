from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import logging

from app.models.agent import AgentInDB
from app.models.application import ApplicationStatus
from app.core.database import mongodb
from app.core.auth import get_current_agent

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/dashboard", response_model=Dict)
async def get_dashboard_analytics(
    current_agent: AgentInDB = Depends(get_current_agent),
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
) -> Dict:
    try:
        db = mongodb.get_db()
        
        # Build base query with date range if provided
        base_query = {"agent_id": str(current_agent.id)}
        if start_date and end_date:
            base_query["created_at"] = {
                "$gte": start_date,
                "$lte": end_date
            }
        elif start_date:
            base_query["created_at"] = {"$gte": start_date}
        elif end_date:
            base_query["created_at"] = {"$lte": end_date}
        
        # Get total applications
        total_applications = await db.applications.count_documents(base_query)
        
        # Get submitted applications
        submitted_query = {**base_query, "status": ApplicationStatus.SUBMITTED}
        submitted_applications = await db.applications.count_documents(submitted_query)
        
        # Get applications in review
        in_review_query = {**base_query, "status": ApplicationStatus.IN_REVIEW}
        in_review_applications = await db.applications.count_documents(in_review_query)
        
        # Get approved applications
        approved_query = {**base_query, "status": ApplicationStatus.APPROVED}
        approved_applications = await db.applications.count_documents(approved_query)
        
        # Get rejected applications
        rejected_query = {**base_query, "status": ApplicationStatus.REJECTED}
        rejected_applications = await db.applications.count_documents(rejected_query)
        
        # Calculate average completion time
        completed_query = {
            **base_query,
            "status": ApplicationStatus.APPROVED,
            "document_uploaded_at": {"$exists": True},
            "bio_submitted_at": {"$exists": True}
        }
        completed_applications = await db.applications.find(completed_query).to_list(length=None)
        
        total_time = 0
        count = 0
        for app in completed_applications:
            if app.get("document_uploaded_at") and app.get("bio_submitted_at"):
                time_diff = app["document_uploaded_at"] - app["bio_submitted_at"]
                total_time += time_diff.total_seconds() / 60  # Convert to minutes
                count += 1
        
        average_completion_time = total_time / count if count > 0 else 0
        
        # Get weekly breakdown
        weekly_breakdown = []
        if start_date and end_date:
            # Calculate weeks between start and end date
            current_date = start_date
            while current_date <= end_date:
                next_week = current_date + timedelta(weeks=1)
                if next_week > end_date:
                    next_week = end_date
                
                count = await db.applications.count_documents({
                    "agent_id": str(current_agent.id),
                    "created_at": {
                        "$gte": current_date,
                        "$lt": next_week
                    }
                })
                
                weekly_breakdown.append({
                    "week": current_date.strftime("%m/%d"),
                    "count": count
                })
                
                current_date = next_week
        else:
            # Default to last 4 weeks if no date range provided
            for i in range(4):
                week_start = datetime.utcnow() - timedelta(weeks=i+1)
                week_end = datetime.utcnow() - timedelta(weeks=i)
                
                count = await db.applications.count_documents({
                    "agent_id": str(current_agent.id),
                    "created_at": {
                        "$gte": week_start,
                        "$lt": week_end
                    }
                })
                
                weekly_breakdown.append({
                    "week": week_start.strftime("%m/%d"),
                    "count": count
                })
        
        return {
            "totalApplications": total_applications,
            "submittedApplications": submitted_applications,
            "inReviewApplications": in_review_applications,
            "approvedApplications": approved_applications,
            "rejectedApplications": rejected_applications,
            "averageCompletionTime": average_completion_time,
            "weeklyBreakdown": weekly_breakdown[::-1]  # Reverse to show oldest week first
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard analytics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch dashboard analytics: {str(e)}"
        )

@router.get("/weekly-submissions", response_model=List[Dict])
async def get_weekly_submissions(
    current_agent: AgentInDB = Depends(get_current_agent),
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
) -> List[Dict]:
    try:
        db = mongodb.get_db()
        
        if start_date and end_date:
            # Calculate weeks between start and end date
            weekly_data = []
            current_date = start_date
            while current_date <= end_date:
                next_week = current_date + timedelta(weeks=1)
                if next_week > end_date:
                    next_week = end_date
                
                count = await db.applications.count_documents({
                    "agent_id": current_agent.id,
                    "created_at": {
                        "$gte": current_date,
                        "$lt": next_week
                    }
                })
                
                weekly_data.append({
                    "week": current_date.strftime("%m/%d"),
                    "count": count
                })
                
                current_date = next_week
        else:
            # Default to last 4 weeks if no date range provided
            weekly_data = []
            for i in range(4):
                week_start = datetime.utcnow() - timedelta(weeks=i+1)
                week_end = datetime.utcnow() - timedelta(weeks=i)
                
                count = await db.applications.count_documents({
                    "agent_id": current_agent.id,
                    "created_at": {
                        "$gte": week_start,
                        "$lt": week_end
                    }
                })
                
                weekly_data.append({
                    "week": week_start.strftime("%m/%d"),
                    "count": count
                })
        
        return weekly_data[::-1]  # Reverse to show oldest week first
    except Exception as e:
        logger.error(f"Error fetching weekly submissions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch weekly submissions: {str(e)}"
        ) 