require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const AirSensorData = require("./models/AirSensorData");
const SoilMoistureData = require("./models/SoilMoistureData");
const startMQTT = require("./mqtt/mqttClient");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------
// Create HTTP + Socket.IO Server
// -------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// -------------------
// MongoDB Connection
// -------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// -------------------
// Start MQTT Listener
// -------------------
startMQTT(io);

// -------------------
// API Routes - AIR SENSOR DATA
// -------------------

// Get latest air sensor data
app.get("/api/air/latest", async (req, res) => {
  try {
    const latestAir = await AirSensorData.findOne().sort({ timestamp: -1 });
    res.json(latestAir);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get last 50 air sensor records
app.get("/api/air/history", async (req, res) => {
  try {
    const airHistory = await AirSensorData.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(airHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------
// API Routes - SOIL MOISTURE DATA
// -------------------

// Get latest soil moisture data
app.get("/api/soil/latest", async (req, res) => {
  try {
    const latestSoil = await SoilMoistureData.findOne().sort({ timestamp: -1 });
    res.json(latestSoil);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get last 50 soil moisture records
app.get("/api/soil/history", async (req, res) => {
  try {
    const soilHistory = await SoilMoistureData.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(soilHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------
// Start Server
// -------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});