require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------
// MongoDB Connection
// -------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// -------------------
// Schema
// -------------------
const sensorSchema = new mongoose.Schema({
  temperature_bmp: Number,
  temperature_dht: Number,
  humidity: Number,
  pressure: Number,
  co2_ppm: Number,
  nh3_ppm: Number,
  air_quality_status: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SensorData = mongoose.model("SensorData", sensorSchema);

// -------------------
// MQTT Connection
// -------------------
const client = mqtt.connect(process.env.MQTT_BROKER);

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe(process.env.MQTT_TOPIC);
  console.log("Subscribed to topic:", process.env.MQTT_TOPIC);
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const newData = new SensorData({
      temperature_bmp: data.temperature_bmp,
      temperature_dht: data.temperature_dht,
      humidity: data.humidity,
      pressure: data.pressure,
      co2_ppm: data.co2_ppm,
      nh3_ppm: data.nh3_ppm,
      air_quality_status: data.air_quality_status
    });

    await newData.save();
    console.log("Data saved:", newData);

  } catch (error) {
    console.log("Error:", error.message);
  }
});

// -------------------
// API Routes
// -------------------

// Get latest data
app.get("/api/latest", async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------
// Start Server
// -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});