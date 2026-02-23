require("dotenv").config();
const mqtt = require("mqtt");
const mongoose = require("mongoose");

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Create Schema
const sensorSchema = new mongoose.Schema({
  temperature: Number,
  pressure: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SensorData = mongoose.model("SensorData", sensorSchema);

// Connect MQTT
const client = mqtt.connect(process.env.MQTT_BROKER);

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe(process.env.MQTT_TOPIC);
  console.log("Subscribed to topic:", process.env.MQTT_TOPIC);
});

// When message received
client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const newData = new SensorData({
      temperature: data.temperature,
      pressure: data.pressure
    });

    await newData.save();
    console.log("Data saved:", newData);

  } catch (error) {
    console.log("Error:", error.message);
  }
});