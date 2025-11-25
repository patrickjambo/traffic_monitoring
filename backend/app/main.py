from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Traffic Monitoring API",
    description="API for AI-Powered Traffic Monitoring System in Kigali",
    version="0.1.0",
)

from app.db.session import engine
from app.db.base_class import Base
# Import models to ensure they are registered with Base
# Import models to ensure they are registered with Base
from app.models import incident, user, alert

Base.metadata.create_all(bind=engine)

# Configure CORS
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Traffic Monitoring API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from app.api import incidents
from app.api.api_v1.endpoints import auth

app.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
