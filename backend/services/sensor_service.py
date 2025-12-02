# services/sensor_service.py

latest_data = {
    "flow1": 0.0,
    "flow2": 0.0
}

def update_sensor_data(flow1, flow2):
    latest_data["flow1"] = flow1
    latest_data["flow2"] = flow2

def get_sensor_data():
    return latest_data
