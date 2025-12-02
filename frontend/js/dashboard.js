// ------------------- GLOBAL VARIABLES -------------------
let flowData1 = [];
let flowData2 = [];
let prevLeakStatus = false;

// Notification elements
const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");

// ------------------- NOTIFICATION FUNCTIONS -------------------
if (notificationBtn && notificationPanel) {
  notificationBtn.addEventListener("click", () => {
    notificationPanel.style.display =
      notificationPanel.style.display === "block" ? "none" : "block";
  });
}

function addNotification(message, color) {
  const li = document.createElement("li");
  li.textContent = message;
  li.style.color = color;
  li.style.margin = "5px 0";
  li.style.fontWeight = "500";
  notificationList.prepend(li);
}

function checkLeakStatus(isLeak) {
  if (prevLeakStatus !== isLeak) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isLeak) addNotification(`🔴 Leak detected at ${time}`, "red");
    else if (prevLeakStatus) addNotification(`🟢 Leak fixed at ${time}`, "green");
  }
  prevLeakStatus = isLeak;
}

// ------------------- CHART -------------------
const ctx = document.getElementById("flowChart").getContext("2d");

const flowChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Flow 1 (L/min)",
        data: flowData1,
        borderColor: "blue",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2
      },
      {
        label: "Flow 2 (L/min)",
        data: flowData2,
        borderColor: "orange",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2
      }
    ]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: "time", // use Luxon time adapter
        time: {
          unit: "minute",
          displayFormats: {
            minute: "HH:mm" // show HH:MM
          },
          tooltipFormat: "HH:mm"
        },
        title: { display: true, text: "Time" }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Flow (L/min)" }
      }
    },
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index", intersect: false }
    },
    interaction: { mode: "nearest", intersect: false }
  }
});

// ------------------- FETCH SENSOR DATA -------------------
let fetchInterval = setInterval(fetchData, 3000);

async function fetchData() {
  try {
    const res = await fetch("http://10.177.38.131:5000/sensor/latest", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const data = await res.json();

    const flow1 = parseFloat(data.sensor_data.flow1);
    const flow2 = parseFloat(data.sensor_data.flow2);

    // Update cards
    document.getElementById("flow1").textContent = flow1.toFixed(2);
    document.getElementById("flow2").textContent = flow2.toFixed(2);

    // Detect leak
    const isLeak = data.alerts.some(alert => alert === "Leak Detected");
    const alertEl = document.getElementById("alert");
    if (isLeak) {
      alertEl.textContent = "Leak Detected";
      alertEl.style.color = "red";

      // Highlight Flow 1 line if leak
      flowChart.data.datasets[0].borderColor = "red";
    } else {
      alertEl.textContent = "No Leak";
      alertEl.style.color = "green";
      flowChart.data.datasets[0].borderColor = "blue";
    }

    // Update chart data
    const now = Date.now();
    flowData1.push({ x: now, y: flow1 });
    flowData2.push({ x: now, y: flow2 });

    // Keep only last 5 minutes of data
    flowData1 = flowData1.filter(p => now - p.x <= 300000);
    flowData2 = flowData2.filter(p => now - p.x <= 300000);

    flowChart.update();

    // Notifications
    checkLeakStatus(isLeak);

  } catch (error) {
    console.error("Backend error:", error);
    const alertEl = document.getElementById("alert");
    if (alertEl) {
      alertEl.textContent = "Server Offline!";
      alertEl.style.color = "gray";
    }

    // Stop further fetches to prevent continuous errors
    clearInterval(fetchInterval);
  }
}

// Initial fetch
fetchData();
