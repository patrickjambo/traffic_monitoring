from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class IncidentBase(BaseModel):
    type: str
    latitude: float
    longitude: float
    description: Optional[str] = None
    video_url: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class Incident(IncidentBase):
    id: int
    timestamp: datetime
    status: str

    class Config:
        from_attributes = True
