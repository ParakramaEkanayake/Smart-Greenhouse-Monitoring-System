const mongoose = require("mongoose");

const SoilMoistureSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    default: "ESP32_002"
  },

  soilMoisture: {
    type: Number,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SoilMoistureData", SoilMoistureSchema);