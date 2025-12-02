# services/sensor_service.py

# This acts like an in-memory database for ESP32 readings
latest_values = {
    "flow1": 0.0,
    "flow2": 0.0
}

def update_sensor_data(flow1, flow2):
    """Save new readings received from ESP32."""
    latest_values["flow1"] = flow1
    latest_values["flow2"] = flow2

def get_sensor_data():
    """Return the most recent readings sent by ESP32."""
    return {
        "flow1": latest_values["flow1"],
        "flow2": latest_values["flow2"]
    }
