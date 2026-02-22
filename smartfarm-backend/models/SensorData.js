const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
  deviceId: String,
  soilMoisture: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorData", SensorSchema);