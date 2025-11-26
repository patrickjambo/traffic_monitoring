from app.db.session import SessionLocal
from app.models.incident import Incident, IncidentType, Severity, IncidentStatus
from datetime import datetime

def seed_incidents():
    db = SessionLocal()
    
    # Check if incidents exist
    if db.query(Incident).count() > 0:
        print("Incidents already exist. Skipping seed.")
        db.close()
        return
    
    incidents = [
        Incident(
            type=IncidentType.CONGESTION,
            severity=Severity.MEDIUM,
            latitude=-1.9441,
            longitude=30.0619,
            description="Heavy traffic near Kigali Heights",
            status=IncidentStatus.VERIFIED
        ),
        Incident(
            type=IncidentType.ACCIDENT,
            severity=Severity.HIGH,
            latitude=-1.9500,
            longitude=30.0580,
            description="Minor accident at Remera junction",
            status=IncidentStatus.VERIFIED
        ),
        Incident(
            type=IncidentType.ROAD_BLOCKAGE,
            severity=Severity.LOW,
            latitude=-1.9350,
            longitude=30.0800,
            description="Road construction near Kimironko market",
            status=IncidentStatus.REPORTED
        )
    ]
    
    for incident in incidents:
        db.add(incident)
    
    db.commit()
    print(f"Successfully seeded {len(incidents)} incidents")
    db.close()

if __name__ == "__main__":
    seed_incidents()
