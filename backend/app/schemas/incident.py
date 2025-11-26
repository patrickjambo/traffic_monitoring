from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID
from app.models.incident import IncidentType, Severity, IncidentStatus

class IncidentBase(BaseModel):
    type: IncidentType
    severity: Severity
    latitude: float
    longitude: float
    address: Optional[str] = None
    description: Optional[str] = None
    confidence_score: Optional[float] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class Incident(IncidentBase):
    id: UUID
    status: IncidentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    reported_by: Optional[UUID] = None
    verified_by: Optional[UUID] = None


    class Config:
        from_attributes = True
