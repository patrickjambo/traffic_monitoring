from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.db.base_class import Base

class IncidentType(str, enum.Enum):
    CONGESTION = "congestion"
    ACCIDENT = "accident"
    ROAD_BLOCKAGE = "road_blockage"

class Incident(Base):
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="verified") # verified, false_positive
