# controllers/api_controller.py

from flask import Blueprint, jsonify, request
from services.sensor_service import get_sensor_data, update_sensor_data
from services.leak_service import detect_leak

api = Blueprint('api', __name__)

# ESP32 posts data here
@api.route('/sensor/update', methods=['POST'])
def update_sensor():
    data = request.get_json()

    flow1 = float(data.get("flow1", 0.0))
    flow2 = float(data.get("flow2", 0.0))

    update_sensor_data(flow1, flow2)

    alerts = detect_leak({"flow1": flow1, "flow2": flow2})

    return jsonify({"status": "updated", "alerts": alerts})


# Frontend dashboard reads data here
@api.route('/sensor/latest', methods=['GET'])
def latest_sensor():
    data = get_sensor_data()
    alerts = detect_leak(data)
    return jsonify({"sensor_data": data, "alerts": alerts})
