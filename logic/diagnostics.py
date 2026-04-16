import sys
import json
import time
from collections import deque

class DiagnosticsEngine:
    def __init__(self):
        self.history = deque(maxlen=10)
        self.threshold = 85.0

    def analyze(self, data):
        device_id = data.get('deviceId')
        value = data.get('value')
        
        # Simple Moving Average Anomaly Detection
        self.history.append(value)
        avg = sum(self.history) / len(self.history)
        
        anomaly = False
        message = ""
        
        if value > self.threshold:
            anomaly = True
            message = f"CRITICAL: {device_id} exceeded safety threshold of {self.threshold}"
        elif len(self.history) > 5 and abs(value - avg) > 10:
            anomaly = True
            message = f"WARNING: Sudden spike detected in {device_id}. Deviation from average: {abs(value-avg):.2f}"
            
        return {
            "isAnomaly": anomaly,
            "message": message,
            "diagnostics": {
                "avg": avg,
                "current": value,
                "rootCause": "Thermal Surge" if value > self.threshold else "Sensor Noise"
            }
        }

def main():
    engine = DiagnosticsEngine()
    print("Python Diagnostics Engine Online", flush=True)
    
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        
        try:
            data = json.loads(line)
            result = engine.analyze(data)
            
            # Output combined data for Node.js
            output = {
                "raw": data,
                "analysis": result
            }
            print(json.dumps(output), flush=True)
        except Exception as e:
            # print(f"Error: {e}", file=sys.stderr)
            pass

if __name__ == "__main__":
    main()
