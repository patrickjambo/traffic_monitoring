import time
import requests
import cv2
import sys
from detector import TrafficDetector

API_URL = "http://localhost:8000/incidents/"
VIDEO_PATH = "traffic_sample.mp4"

def main():
    print("Starting AI Traffic Monitor Engine (YOLOv8)...")
    
    try:
        detector = TrafficDetector()
    except Exception as e:
        print(f"Error loading detector: {e}")
        return

    print(f"Opening video source: {VIDEO_PATH}")
    cap = cv2.VideoCapture(VIDEO_PATH)
    
    if not cap.isOpened():
        print(f"Error: Could not open video file {VIDEO_PATH}")
        return

    print("Processing video stream...")
    
    last_report_time = 0
    report_interval = 5.0 # Seconds between reports
    
    try:
        while True:
            ret, frame = cap.read()
            
            if not ret:
                print("End of video stream. Restarting...")
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            
            # Resize for faster processing (optional)
            # frame = cv2.resize(frame, (640, 480))
            
            incident = detector.process_frame(frame)
            
            if incident:
                current_time = time.time()
                if current_time - last_report_time > report_interval:
                    print(f"[!] Incident Detected: {incident['type']} - {incident['description']}")
                    
                    try:
                        response = requests.post(API_URL, json=incident)
                        if response.status_code == 200:
                            print("    -> Reported to Backend successfully.")
                            last_report_time = current_time
                        else:
                            print(f"    -> Failed to report: {response.status_code} - {response.text}")
                    except Exception as e:
                        print(f"    -> Connection Error: {e}")
                else:
                    # Incident detected but rate limited
                    pass
            
            # Display frame (optional, might not work in headless env)
            # cv2.imshow('Traffic Monitor', frame)
            # if cv2.waitKey(1) & 0xFF == ord('q'):
            #     break
            
            # Simulate real-time (remove if you want max speed)
            # time.sleep(0.03) 
            
    except KeyboardInterrupt:
        print("\nStopping AI Engine.")
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
