from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Job Models
class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    location: str
    status: str  # Active, Inactive, Closed
    jobType: str  # Full-time, Part-time, Contract, Internship
    salary: str
    description: str
    postedDate: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    applicants: int = 0
    experience: Optional[str] = None
    deadline: Optional[str] = None

class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    status: str
    jobType: str
    salary: str
    description: str
    experience: Optional[str] = None
    deadline: Optional[str] = None
    applicants: Optional[int] = 0

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    jobType: Optional[str] = None
    salary: Optional[str] = None
    description: Optional[str] = None
    applicants: Optional[int] = None


# Routes
@api_router.get("/")
async def root():
    return {"message": "Job Management API"}

@api_router.post("/jobs", response_model=Job)
async def create_job(job_input: JobCreate):
    job_dict = job_input.model_dump()
    job_obj = Job(**job_dict)
    
    doc = job_obj.model_dump()
    doc['postedDate'] = doc['postedDate'].isoformat()
    
    await db.jobs.insert_one(doc)
    return job_obj

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(
    status: Optional[str] = None,
    jobType: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    
    if status:
        query['status'] = status
    if jobType:
        query['jobType'] = jobType
    if location:
        query['location'] = location
    if search:
        query['$or'] = [
            {'title': {'$regex': search, '$options': 'i'}},
            {'company': {'$regex': search, '$options': 'i'}}
        ]
    
    jobs = await db.jobs.find(query, {"_id": 0}).to_list(1000)
    
    for job in jobs:
        if isinstance(job['postedDate'], str):
            job['postedDate'] = datetime.fromisoformat(job['postedDate'])
    
    return jobs

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if isinstance(job['postedDate'], str):
        job['postedDate'] = datetime.fromisoformat(job['postedDate'])
    
    return job

@api_router.put("/jobs/{job_id}", response_model=Job)
async def update_job(job_id: str, job_update: JobUpdate):
    existing_job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    
    if not existing_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = {k: v for k, v in job_update.model_dump().items() if v is not None}
    
    if update_data:
        await db.jobs.update_one({"id": job_id}, {"$set": update_data})
    
    updated_job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    
    if isinstance(updated_job['postedDate'], str):
        updated_job['postedDate'] = datetime.fromisoformat(updated_job['postedDate'])
    
    return updated_job

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    result = await db.jobs.delete_one({"id": job_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job deleted successfully"}

@api_router.post("/jobs/seed")
async def seed_jobs():
    # Clear existing jobs
    await db.jobs.delete_many({})
    
    sample_jobs = [
        {
            "id": str(uuid.uuid4()),
            "title": "Full Stack Developer",
            "company": "TechCorp",
            "location": "Remote",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "₹12,000/m",
            "description": "We are looking for an experienced Full Stack Developer to join our team.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 25,
            "experience": "1-3 yr Exp"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Node Js Developer",
            "company": "DevSolutions",
            "location": "Onsite",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "₹12,500/m",
            "description": "Join our team as a Node.js Developer specializing in backend development.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 18,
            "experience": "1-2 yr Exp"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "UX/UI Designer",
            "company": "DesignStudio",
            "location": "Chennai",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "₹10,000/m",
            "description": "Experienced UX/UI designer needed for creating amazing user experiences.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 32,
            "experience": "1-3 yr Exp"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Backend Python Engineer",
            "company": "CloudTech",
            "location": "Bangalore",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "₹15,000/m",
            "description": "Looking for a talented Python developer for backend development.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 42,
            "experience": "2-4 yr Exp"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "React Developer",
            "company": "WebWorks",
            "location": "Mumbai",
            "status": "Active",
            "jobType": "Contract",
            "salary": "₹11,000/m",
            "description": "Contract position for React development.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 15,
            "experience": "1-2 yr Exp"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "DevOps Engineer",
            "company": "Infrastructure Co",
            "location": "Delhi",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "₹18,000/m",
            "description": "DevOps engineer to manage and optimize our infrastructure.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 28,
            "experience": "2-5 yr Exp"
        }
    ]
    
    await db.jobs.insert_many(sample_jobs)
    return {"message": f"Successfully seeded {len(sample_jobs)} jobs"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
