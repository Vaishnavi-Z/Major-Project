import pickle
import os
import pandas as pd

# Load the trained model once
model_path = os.path.join(os.path.dirname(__file__), '../models/leak_detector.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

def detect_leak(sensor_data):
    """Use ML model to predict leaks"""
    # ✅ Create DataFrame with proper feature names
    features = pd.DataFrame([[sensor_data["flow_rate"],
                              sensor_data["pressure"],
                              sensor_data["level"]]],
                            columns=["flow_rate", "pressure", "level"])

    prediction = model.predict(features)[0]
    
    if prediction == 1:
        return ["Leak Detected"]
    else:
        return []
