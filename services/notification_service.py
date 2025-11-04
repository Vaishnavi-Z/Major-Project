def send_notification(alerts, sensor_data):
    """Simple console notification"""
    if alerts:
        print("ALERT! Detected issues:", alerts)
        print("Sensor Data:", sensor_data)
