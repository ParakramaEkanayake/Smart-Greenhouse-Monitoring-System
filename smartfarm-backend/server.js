// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const mongoose = require("mongoose");

// Models
const SensorData = require("./models/SensorData"); // existing BMP280/DHT
const startSoilSensor2Mqtt = require("./mqtt/soilSensor2Mqtt"); // YL-69 MQTT client
const soilSensor2Routes = require("./routes/soilSensor2Routes"); // YL-69 routes

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// --- Existing BMP280/DHT MQTT flow ---
const client = mqtt.connect(process.env.MQTT_BROKER);

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe(process.env.MQTT_TOPIC); // existing BMP280/DHT topic
  console.log("Subscribed to topic:", process.env.MQTT_TOPIC);
});

client.on("message", async (topic, message) => {
  if (topic === process.env.MQTT_TOPIC) {
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
      console.log("BMP280/DHT Data saved:", newData);

    } catch (err) {
      console.log("BMP280/DHT MQTT parse/save error:", err.message);
    }
  }
});

// --- Start YL-69 soil sensor MQTT client ---
startSoilSensor2Mqtt(); // keeps YL-69 completely modular

// --- Routes ---
// Existing sensor routes
app.use("/api/data", require("./routes/sensorRoutes"));

// YL-69 soil sensor routes
app.use("/api/soil-sensor-2", soilSensor2Routes);

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));