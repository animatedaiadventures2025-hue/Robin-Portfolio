"""
Interview Routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
import random
from datetime import datetime

router = APIRouter()

# In-memory storage (for MVP)
interviews = {}
questions_db = {
    "it_services": {
        "software_engineer": [
            "Tell me about a project you worked on.",
            "What is your greatest strength as a developer?",
            "Describe a challenging bug you solved.",
            "How do you handle tight deadlines?",
            "Tell me about a time you worked in a team.",
            "What programming languages are you proficient in?",
            "Describe your approach to code reviews.",
            "How do you keep up with new technologies?",
            "Tell me about a time you failed and what you learned.",
            "Why do you want to work in IT services?"
        ],
        "data_scientist": [
            "Tell me about a data project you've worked on.",
            "What machine learning algorithms are you familiar with?",
            "How do you handle missing data?",
            "Describe a time you made data-driven decisions.",
            "What tools do you use for data visualization?",
            "How do you validate your models?",
            "Tell me about a challenging analysis you did.",
            "What is your approach to feature engineering?",
            "How do you communicate findings to non-tech stakeholders?",
            "Why data science?"
        ]
    },
    "product": {
        "product_manager": [
            "Tell me about a product you launched.",
            "How do you prioritize features?",
            "Describe a time you pivoted a strategy.",
            "How do you gather customer feedback?",
            "Tell me about a failed product and what you learned.",
            "How do you work with engineers?",
            "What metrics do you track?",
            "Describe your ideal product team.",
            "How do you handle competing priorities?",
            "Why product management?"
        ]
    },
    "banking": {
        "analyst": [
            "Tell me about a financial analysis you've done.",
            "How do you assess risk?",
            "Describe a time you improved a process.",
            "What financial modeling experience do you have?",
            "How do you stay updated on market trends?",
            "Tell me about a deal you worked on.",
            "What tools do you use for analysis?",
            "How do you handle pressure?",
            "Why banking?",
            "Where do you see the finance industry heading?"
        ]
    },
    "consulting": {
        "consultant": [
            "Tell me about a problem you solved for a client.",
            "How do you approach new projects?",
            "Describe a time you had to learn quickly.",
            "How do you handle difficult clients?",
            "Tell me about a team project.",
            "What industries interest you?",
            "How do you structure your analysis?",
            "Why consulting?",
            "Where do you see yourself in 5 years?",
            "What is your biggest strength?"
        ]
    },
    "marketing": {
        "marketing_manager": [
            "Tell me about a campaign you ran.",
            "How do you measure campaign success?",
            "Describe a time you innovated.",
            "How do you understand customer needs?",
            "What digital marketing tools do you use?",
            "Tell me about a failed campaign.",
            "How do you allocate budget?",
            "What channels do you prefer and why?",
            "Why this company?",
            "Where do you see digital marketing heading?"
        ]
    },
    "healthcare": {
        "healthcare_manager": [
            "Tell me about your healthcare experience.",
            "How do you handle patient concerns?",
            "Describe a time you improved processes.",
            "What EHR systems have you used?",
            "How do you ensure compliance?",
            "Tell me about working with doctors.",
            "What is patient-centered care to you?",
            "How do you handle emergencies?",
            "Why healthcare?",
            "Where do you see healthcare heading?"
        ]
    },
    "manufacturing": {
        "operations_manager": [
            "Tell me about a production project.",
            "How do you ensure quality?",
            "Describe a time you reduced costs.",
            "What manufacturing processes do you know?",
            "How do you handle supply chain issues?",
            "Tell me about a team you led.",
            "What metrics do you track?",
            "How do you handle safety?",
            "Why manufacturing?",
            "Where do you see the industry?"
        ]
    },
    "education": {
        "teacher": [
            "Tell me about your teaching style.",
            "How do you handle difficult students?",
            "Describe a lesson that didn't work.",
            "How do you assess student progress?",
            "What technology do you use in class?",
            "Tell me about a success story.",
            "How do you engage parents?",
            "Why teaching?",
            "Where do you see education heading?",
            "What is your greatest strength?"
        ]
    }
}

# Default questions for any role
default_questions = [
    "Tell me about yourself.",
    "What is your greatest strength?",
    "What is your greatest weakness?",
    "Why do you want to work here?",
    "Where do you see yourself in 5 years?",
    "Tell me about a challenge you overcame.",
    "What are your salary expectations?",
    "Why should we hire you?",
    "Do you have any questions for us?",
    "Is there anything you'd like to add?"
]

class InterviewStart(BaseModel):
    industry: str
    role: str
    jd: Optional[str] = ""
    persona: Optional[str] = "supportive"

class QuestionAnswer(BaseModel):
    interview_id: str
    question_index: int
    answer: str
    audio_duration: Optional[int] = 0

class InterviewResponse(BaseModel):
    id: str
    industry: str
    role: str
    questions: List[str]
    answers: List[dict]
    scores: List[int]
    status: str
    created_at: str

@router.post("/start")
def start_interview(data: InterviewStart):
    """Start a new interview session"""
    interview_id = str(uuid.uuid4())
    
    # Get questions for industry/role or use defaults
    industry_questions = questions_db.get(data.industry, {})
    role_questions = industry_questions.get(data.role, default_questions)
    
    # Select 10 questions (shuffle if using defaults)
    questions = role_questions[:10]
    if questions == default_questions:
        random.shuffle(questions)
    
    interviews[interview_id] = {
        "id": interview_id,
        "industry": data.industry,
        "role": data.role,
        "jd": data.jd,
        "persona": data.persona,
        "questions": questions,
        "answers": [],
        "scores": [],
        "status": "in_progress",
        "created_at": datetime.now().isoformat()
    }
    
    return {
        "interview_id": interview_id,
        "questions": questions,
        "total": len(questions)
    }

@router.get("/{interview_id}")
def get_interview(interview_id: str):
    """Get interview by ID"""
    if interview_id not in interviews:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interviews[interview_id]

@router.post("/answer")
def submit_answer(data: QuestionAnswer):
    """Submit an answer and get evaluation"""
    if data.interview_id not in interviews:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = interviews[data.interview_id]
    
    # Simple evaluation (mock AI for MVP)
    score = random.randint(5, 9)
    
    # Generate feedback based on question type
    strengths = []
    improvements = []
    
    if "strength" in interview["questions"][data.question_index].lower():
        strengths.append("Identified a clear strength")
        improvements.append("Add more specific examples")
    elif "challenge" in interview["questions"][data.question_index].lower():
        strengths.append("Clear problem-solution structure")
        improvements.append("Include quantifiable results")
    elif "team" in interview["questions"][data.question_index].lower():
        strengths.append("Showed collaboration skills")
        improvements.append("Highlight your specific contribution")
    else:
        strengths.append("Good response")
        improvements.append("Add more specific details")
    
    evaluation = {
        "score": score,
        "strengths": strengths,
        "improvements": improvements,
        "tip": f"Question {data.question_index + 1} of {len(interview['questions'])} complete"
    }
    
    # Store answer
    interview["answers"].append({
        "question": interview["questions"][data.question_index],
        "answer": data.answer,
        "evaluation": evaluation
    })
    interview["scores"].append(score)
    
    # Check if complete
    next_index = len(interview["answers"])
    is_complete = next_index >= len(interview["questions"])
    
    if is_complete:
        interview["status"] = "complete"
    
    return {
        "evaluation": evaluation,
        "next_question": next_index if not is_complete else None,
        "is_complete": is_complete,
        "progress": f"{next_index}/{len(interview['questions'])}"
    }

@router.get("/{interview_id}/report")
def get_report(interview_id: str):
    """Get final interview report"""
    if interview_id not in interviews:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = interviews[interview_id]
    
    if interview["status"] != "complete":
        raise HTTPException(status_code=400, detail="Interview not complete")
    
    scores = interview["scores"]
    avg_score = sum(scores) / len(scores) if scores else 0
    
    # Dimension breakdown (simulated)
    content_score = min(10, avg_score + random.randint(-1, 1))
    star_score = min(10, avg_score + random.randint(-1, 1))
    comm_score = min(10, avg_score + random.randint(-2, 1))
    confidence_score = min(10, avg_score + random.randint(-1, 2))
    
    return {
        "interview_id": interview_id,
        "overall_score": round(avg_score, 1),
        "dimensions": {
            "content_quality": content_score,
            "star_structure": star_score,
            "communication": comm_score,
            "confidence": confidence_score
        },
        "questions": [
            {
                "question": a["question"],
                "score": a["evaluation"]["score"],
                "strengths": a["evaluation"]["strengths"],
                "improvements": a["evaluation"]["improvements"]
            }
            for a in interview["answers"]
        ],
        "summary": {
            "total": len(scores),
            "completed_at": interview["created_at"]
        }
    }

@router.post("/{interview_id}/skip")
def skip_question(interview_id: str):
    """Skip current question"""
    if interview_id not in interviews:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = interviews[interview_id]
    next_index = len(interview["answers"])
    
    if next_index >= len(interview["questions"]):
        interview["status"] = "complete"
        return {"is_complete": True}
    
    return {
        "next_question": next_index,
        "question": interview["questions"][next_index],
        "progress": f"{next_index}/{len(interview['questions'])}"
    }