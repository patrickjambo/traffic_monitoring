from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum
from app.db.base_class import Base

class IncidentType(str, enum.Enum):
    CONGESTION = "congestion"
    ACCIDENT = "accident"
    ROAD_BLOCKAGE = "road_blockage"
    HAZARD = "hazard"

class Severity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class IncidentStatus(str, enum.Enum):
    REPORTED = "reported"
    VERIFIED = "verified"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    FALSE_POSITIVE = "false_positive"

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(Enum(IncidentType), nullable=False)
    severity = Column(Enum(Severity), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    description = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.REPORTED)
    video_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    reported_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
