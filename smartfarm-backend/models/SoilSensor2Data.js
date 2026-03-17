const mongoose = require("mongoose");

const SoilSensor2Schema = new mongoose.Schema({
  deviceId: String,
  soilMoisture: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SoilSensor2Data", SoilSensor2Schema);