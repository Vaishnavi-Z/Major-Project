// ------------------- GLOBAL VARIABLES -------------------
let flowData = []; // store last 5 minutes of readings
let prevLeakStatus = false; // tracks previous leak state

// Notification elements
const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");

// ------------------- NOTIFICATION FUNCTIONS -------------------
// Toggle notification panel
if (notificationBtn && notificationPanel) {
  notificationBtn.addEventListener("click", () => {
    notificationPanel.style.display =
      notificationPanel.style.display === "block" ? "none" : "block";
  });
}

// Add notification to list
function addNotification(message, color) {
  if (!notificationList) return;
  const li = document.createElement("li");
  li.textContent = message;
  li.style.color = color;
  li.style.margin = "5px 0";
  li.style.fontWeight = "500";
  notificationList.prepend(li);
}

// Check leak status and trigger notification if state changes
function checkLeakStatus(isLeak) {
  if (prevLeakStatus !== isLeak) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isLeak) addNotification(`🔴 Leak detected at ${time}`, "red");
    else if (prevLeakStatus) addNotification(`🟢 Leak fixed at ${time}`, "green");
  }
  prevLeakStatus = isLeak;
}

// ------------------- CHART.JS GRAPH -------------------
const ctx = document.getElementById("flowChart").getContext("2d");
const flowChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [{
      label: "Flow Rate (L/min)",
      data: flowData,
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: "white",
      segment: {
        borderColor: ctx => {
          const p0Leak = ctx.p0?.raw?.custom?.leak;
          const p1Leak = ctx.p1?.raw?.custom?.leak;
          return p0Leak || p1Leak ? "red" : "green";
        }
      }
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          displayFormats: { minute: "HH:mm" }
        },
        title: { display: true, text: "Time (HH:MM)" }
      },
      y: {
        title: { display: true, text: "Flow Rate" },
        beginAtZero: true
      }
    },
    plugins: {
      legend: { display: true }
    }
  }
});

// ------------------- FETCH SENSOR DATA -------------------
async function fetchData() {
  try {
    const res = await fetch("http://127.0.0.1:5000/sensor/latest");
    const data = await res.json();

    const flowRate = data.sensor_data.flow_rate;
    const isLeak = data.alerts.length > 0;

    // Update dashboard cards
    document.getElementById("flow").textContent = flowRate.toFixed(2);
    document.getElementById("pressure").textContent = data.sensor_data.pressure.toFixed(2);
    document.getElementById("level").textContent = data.sensor_data.level.toFixed(2);

    // Update alert text
    const alertEl = document.getElementById("alert");
    if (isLeak) {
      alertEl.textContent = data.alerts.join(", ");
      alertEl.style.color = "red";
    } else {
      alertEl.textContent = "No Leak Detected";
      alertEl.style.color = "green";
    }

    // Update 5-minute flowData
    const now = Date.now();
    flowData.push({ x: now, y: flowRate, custom: { leak: isLeak } });
    flowData = flowData.filter(p => now - p.x <= 300000); // keep last 5 minutes

    // Update chart
    flowChart.data.datasets[0].data = flowData;
    flowChart.update();

    // Check notifications
    checkLeakStatus(isLeak);

  } catch (err) {
    console.error("Error fetching data:", err);
    const alertEl = document.getElementById("alert");
    if (alertEl) alertEl.textContent = "Error connecting to backend!";
  }
}

// ------------------- INITIAL + PERIODIC FETCH -------------------
fetchData();
setInterval(fetchData, 3000); // every 3 seconds
  