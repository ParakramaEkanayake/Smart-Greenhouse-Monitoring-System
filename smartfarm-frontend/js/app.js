const ctx = document.getElementById("soilChart").getContext("2d");

let labels = [];
let values = [];

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Soil Moisture",
      data: values,
      borderWidth: 2
    }]
  }
});

// Load historical data
fetch("http://localhost:5000/api/data")
  .then(res => res.json())
  .then(data => {
    data.reverse().forEach(d => {
      labels.push(new Date(d.timestamp).toLocaleTimeString());
      values.push(d.soilMoisture);
    });
    chart.update();
  });

// Real-time update
const socket = io("http://localhost:5000");

socket.on("newData", (data) => {
  labels.push(new Date(data.timestamp).toLocaleTimeString());
  values.push(data.soilMoisture);

  if (labels.length > 20) {
    labels.shift();
    values.shift();
  }

  chart.update();
});