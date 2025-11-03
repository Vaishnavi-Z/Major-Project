from flask import Blueprint, jsonify
from services.sensor_service import get_sensor_data
from services.leak_service import detect_leak
from services.notification_service import send_notification

api = Blueprint('api', __name__)

@api.route('/sensor/latest', methods=['GET'])
def latest_sensor():
    data = get_sensor_data()
    alerts = detect_leak(data)
    send_notification(alerts, data)
    return jsonify({"sensor_data": data, "alerts": alerts})
