from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum
from app.db.base_class import Base

class AlertType(str, enum.Enum):
    PUSH = "push"
    SMS = "sms"
    EMAIL = "email"
    IN_APP = "in_app"

class TargetAudience(str, enum.Enum):
    ALL = "all"
    POLICE = "police"
    PUBLIC = "public"
    SPECIFIC_AREA = "specific_area"

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=True)
    alert_type = Column(Enum(AlertType), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    target_audience = Column(Enum(TargetAudience), nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    delivered_count = Column(Integer, default=0)
    read_count = Column(Integer, default=0)
