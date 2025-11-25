import cv2
from ultralytics import YOLO
import numpy as np

class TrafficDetector:
    def __init__(self, model_path="yolov8n.pt"):
        print(f"Loading YOLOv8 model from {model_path}...")
        self.model = YOLO(model_path)
        # COCO classes for vehicles
        self.vehicle_classes = [2, 3, 5, 7] # car, motorcycle, bus, truck
        
        # Define a fixed location for this camera feed (simulated)
        self.location = {"lat": -1.9441, "lng": 30.0619, "name": "Kigali Heights"}

    def process_frame(self, frame):
        """
        Detects vehicles in the frame using YOLOv8.
        Returns an incident dict if congestion is detected.
        """
        if frame is None:
            return None

        # Run inference
        results = self.model(frame, verbose=False)
        
        vehicle_count = 0
        
        # Process detections
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls = int(box.cls[0])
                if cls in self.vehicle_classes:
                    vehicle_count += 1
                    
                    # Draw bounding box for visualization (optional)
                    # x1, y1, x2, y2 = map(int, box.xyxy[0])
                    # cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Logic for "Congestion"
        # If more than 5 vehicles are detected, flag as congestion
        if vehicle_count > 5:
            return {
                "type": "congestion",
                "latitude": self.location["lat"],
                "longitude": self.location["lng"],
                "description": f"High traffic detected: {vehicle_count} vehicles at {self.location['name']}",
                "video_url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", # Placeholder
                "status": "verified",
                "vehicle_count": vehicle_count
            }
            
        return None
