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
            "title": "Senior Full Stack Developer",
            "company": "Tech Solutions Inc",
            "location": "New York, NY",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "$120,000 - $150,000",
            "description": "We are looking for an experienced Full Stack Developer to join our team.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 25
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Frontend React Developer",
            "company": "Digital Dynamics",
            "location": "San Francisco, CA",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "$100,000 - $130,000",
            "description": "Join our team as a Frontend Developer specializing in React.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 18
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Backend Python Engineer",
            "company": "CloudTech Systems",
            "location": "Austin, TX",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "$110,000 - $140,000",
            "description": "Experienced Python developer needed for backend development.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 32
        },
        {
            "id": str(uuid.uuid4()),
            "title": "UI/UX Designer",
            "company": "Creative Studios",
            "location": "Los Angeles, CA",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "$90,000 - $120,000",
            "description": "Looking for a talented UI/UX designer to create amazing user experiences.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 42
        },
        {
            "id": str(uuid.uuid4()),
            "title": "DevOps Engineer",
            "company": "Infrastructure Co",
            "location": "Seattle, WA",
            "status": "Inactive",
            "jobType": "Full-time",
            "salary": "$115,000 - $145,000",
            "description": "DevOps engineer to manage and optimize our infrastructure.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 15
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mobile App Developer",
            "company": "AppWorks Ltd",
            "location": "Boston, MA",
            "status": "Active",
            "jobType": "Contract",
            "salary": "$95,000 - $125,000",
            "description": "Contract position for mobile app development using React Native.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 28
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Data Scientist",
            "company": "Analytics Pro",
            "location": "Chicago, IL",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "$130,000 - $160,000",
            "description": "Data scientist position focusing on machine learning and analytics.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 37
        },
        {
            "id": str(uuid.uuid4()),
            "title": "QA Engineer",
            "company": "Quality Systems",
            "location": "Denver, CO",
            "status": "Closed",
            "jobType": "Full-time",
            "salary": "$85,000 - $110,000",
            "description": "Quality assurance engineer for automated testing.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 12
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Product Manager",
            "company": "Innovation Hub",
            "location": "New York, NY",
            "status": "Active",
            "jobType": "Full-time",
            "salary": "$125,000 - $155,000",
            "description": "Product manager to lead product strategy and development.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 20
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Junior Web Developer",
            "company": "StartUp Tech",
            "location": "Portland, OR",
            "status": "Active",
            "jobType": "Part-time",
            "salary": "$60,000 - $80,000",
            "description": "Entry-level web developer position for passionate individuals.",
            "postedDate": datetime.now(timezone.utc).isoformat(),
            "applicants": 45
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
