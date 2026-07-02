from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
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
SOVEREIGN_KEY = os.environ['SOVEREIGN_KEY']

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class BriefingCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    org: str = Field(min_length=1, max_length=200)
    role: str = Field(min_length=1, max_length=200)
    sector: str = Field(min_length=1, max_length=100)
    requirements: str = Field(min_length=1, max_length=5000)


RATE_WINDOW_SECONDS = 60
RATE_MAX_REQUESTS = 5
_rate_registry: dict = {}


def _check_rate_limit(ip: str):
    now = time.time()
    hits = [t for t in _rate_registry.get(ip, []) if now - t < RATE_WINDOW_SECONDS]
    if len(hits) >= RATE_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="CHANNEL SATURATED — RATE LIMIT EXCEEDED")
    hits.append(now)
    _rate_registry[ip] = hits


@api_router.post("/v1/briefing")
async def create_briefing(
    payload: BriefingCreate,
    request: Request,
    x_sovereign_key: Optional[str] = Header(default=None),
):
    if x_sovereign_key != SOVEREIGN_KEY:
        raise HTTPException(status_code=401, detail="INVALID SOVEREIGN KEY")
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    _check_rate_limit(ip)
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["timestamp"] = datetime.now(timezone.utc).isoformat()
    doc["origin_ip"] = ip
    await db.briefings.insert_one({**doc})
    return {"status": "QUEUED", "id": doc["id"]}


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

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