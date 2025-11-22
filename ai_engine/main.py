import time
import requests
import cv2
import sys
from detector import TrafficDetector

API_URL = "http://localhost:8000/incidents/"

def main():
    print("Starting AI Traffic Monitor Engine...")
    detector = TrafficDetector()
    
    # In a real scenario, we would capture from a camera:
    # cap = cv2.VideoCapture(0)
    
    print("Simulating video stream processing...")
    
    try:
        while True:
            # Simulate reading a frame
            # ret, frame = cap.read()
            frame = None # Placeholder
            
            incident = detector.process_frame(frame)
            
            if incident:
                print(f"[!] Incident Detected: {incident['type']} at {incident['description']}")
                
                try:
                    response = requests.post(API_URL, json=incident)
                    if response.status_code == 200:
                        print("    -> Reported to Backend successfully.")
                    else:
                        print(f"    -> Failed to report: {response.status_code} - {response.text}")
                except Exception as e:
                    print(f"    -> Connection Error: {e}")
            
            # Keep the loop running at a reasonable pace for the demo
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping AI Engine.")

if __name__ == "__main__":
    main()
