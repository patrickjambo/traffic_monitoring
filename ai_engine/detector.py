import random
import time

class TrafficDetector:
    def __init__(self):
        self.incident_types = ["congestion", "accident", "road_blockage"]
        self.locations = [
            {"lat": -1.9441, "lng": 30.0619, "name": "Kigali Heights"},
            {"lat": -1.9500, "lng": 30.0580, "name": "Remera Junction"},
            {"lat": -1.9350, "lng": 30.0800, "name": "Kimironko Market"},
            {"lat": -1.9700, "lng": 30.1000, "name": "Kanombe"},
            {"lat": -1.9550, "lng": 30.1050, "name": "Kabeza"}
        ]

    def process_frame(self, frame):
        """
        Simulates processing a video frame.
        In a real system, this would use a YOLO/TensorFlow model.
        Returns an incident dict if detected, else None.
        """
        # Simulate processing time
        time.sleep(0.1)

        # 5% chance to detect an incident per "frame" (for demo purposes)
        if random.random() < 0.05:
            incident_type = random.choice(self.incident_types)
            location = random.choice(self.locations)
            
            return {
                "type": incident_type,
                "latitude": location["lat"],
                "longitude": location["lng"],
                "description": f"Detected {incident_type} at {location['name']}",
                "video_url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", # Placeholder
                "status": "verified"
            }
        return None
