"""
User Routes
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import uuid

router = APIRouter()

# In-memory user storage (for MVP)
users = {}
interview_history = {}

class User(BaseModel):
    phone: str
    name: str = ""
    industry: str = ""
    role: str = ""

class UserStats(BaseModel):
    total_interviews: int
    avg_score: float
    best_score: int
    last_interview: Optional[str] = None

@router.post("/register")
def register_user(user: User):
    """Register a new user"""
    user_id = user.phone  # Use phone as ID for MVP
    
    if user_id not in users:
        users[user_id] = {
            "id": user_id,
            "phone": user.phone,
            "name": user.name,
            "industry": user.industry,
            "role": user.role,
            "created_at": str(uuid.uuid4())
        }
        interview_history[user_id] = []
    
    return {
        "success": True,
        "user_id": user_id,
        "message": "User registered"
    }

@router.get("/{user_id}")
def get_user(user_id: str):
    """Get user by ID"""
    if user_id not in users:
        return {
            "id": user_id,
            "phone": user_id,
            "name": "Guest",
            "industry": "",
            "role": ""
        }
    return users[user_id]

@router.get("/{user_id}/stats")
def get_user_stats(user_id: str):
    """Get user statistics"""
    interviews = interview_history.get(user_id, [])
    
    if not interviews:
        return {
            "total_interviews": 0,
            "avg_score": 0,
            "best_score": 0,
            "day_streak": 0
        }
    
    scores = [i.get("score", 0) for i in interviews]
    
    return {
        "total_interviews": len(interviews),
        "avg_score": round(sum(scores) / len(scores), 1 if scores else 0,
        "best_score": max(scores) if scores else 0,
        "last_interview": interviews[-1].get("date") if interviews else None
    }

@router.get("/{user_id}/history")
def get_interview_history(user_id: str):
    """Get user's interview history"""
    return interview_history.get(user_id, [])

@router.post("/{user_id}/history")
def add_to_history(user_id: str, data: dict):
    """Add interview to history"""
    if user_id not in interview_history:
        interview_history[user_id] = []
    
    interview_history[user_id].append({
        "id": data.get("interview_id"),
        "score": data.get("score"),
        "industry": data.get("industry"),
        "role": data.get("role"),
        "date": data.get("date")
    })
    
    return {"success": True}