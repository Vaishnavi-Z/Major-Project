def detect_leak(data):
    flow1 = data["flow1"]
    flow2 = data["flow2"]

    alerts = []

    # Leak detection rule
    if flow1 - flow2 > 5:  # threshold difference
        alerts.append("Leak Detected")
    else:
        alerts.append("No Leak")

    return alerts
