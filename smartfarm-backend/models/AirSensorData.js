const mongoose = require("mongoose");

const AirSensorSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    default: "ESP32_001"
  },

  temperature_bmp: {
    type: Number,
    required: true
  },

  temperature_dht: {
    type: Number,
    required: true
  },

  humidity: {
    type: Number,
    required: true
  },

  pressure: {
    type: Number,
    required: true
  },

  co2_ppm: {
    type: Number,
    required: true
  },

  nh3_ppm: {
    type: Number,
    required: true
  },

  air_quality_status: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AirSensorData", AirSensorSchema);