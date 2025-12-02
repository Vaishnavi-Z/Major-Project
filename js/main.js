async function fetchSensorData() {
    const response = await fetch('http://127.0.0.1:5000/sensor/latest');
    const data = await response.json();
    
    document.getElementById('flow').innerText = data.sensor_data.flow_rate;
    document.getElementById('pressure').innerText = data.sensor_data.pressure;
    document.getElementById('level').innerText = data.sensor_data.level;
    document.getElementById('alerts').innerText = data.alerts.join(', ');
}

// Fetch every 2 seconds
setInterval(fetchSensorData, 2000);
