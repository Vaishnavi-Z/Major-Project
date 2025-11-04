import random

def get_sensor_data():
    """Simulate sensor readings"""
    data = {
        "flow_rate": round(random.uniform(10, 20), 2),
        "pressure": round(random.uniform(30, 50), 2),
        "level": round(random.uniform(5, 20), 2)
    }
    return data
