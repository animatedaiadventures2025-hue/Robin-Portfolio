"""
Talent Bridge API - FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes import interview, user

app = FastAPI(
    title="Talent Bridge API",
    description="AI Interview Practice App API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(interview.router, prefix="/api", tags=["interview"])
app.include_router(user.router, prefix="/api", tags=["user"])

@app.get("/")
def root():
    return {
        "name": "Talent Bridge API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

# If running in standalone mode without frontend
# import uvicorn
# uvicorn.run(app, host="0.0.0.0", port=8000)