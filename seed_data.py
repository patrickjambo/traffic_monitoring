import sys
import os
from datetime import datetime

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.db.session import SessionLocal
from app.models.incident import Incident, IncidentType

def seed():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(Incident).count() > 0:
        print("Data already exists.")
        return

    incidents = [
        Incident(
            type=IncidentType.CONGESTION,
            latitude=-1.9441,
            longitude=30.0619,
            description="Heavy traffic near Kigali Heights.",
            status="verified",
            timestamp=datetime.now()
        ),
        Incident(
            type=IncidentType.ACCIDENT,
            latitude=-1.9500,
            longitude=30.0580,
            description="Minor accident at Remera junction.",
            status="verified",
            timestamp=datetime.now()
        ),
        Incident(
            type=IncidentType.ROAD_BLOCKAGE,
            latitude=-1.9350,
            longitude=30.0800,
            description="Road construction near Kimironko market.",
            status="verified",
            timestamp=datetime.now()
        )
    ]

    for incident in incidents:
        db.add(incident)
    
    db.commit()
    print("Seeded 3 incidents.")
    db.close()

if __name__ == "__main__":
    seed()
