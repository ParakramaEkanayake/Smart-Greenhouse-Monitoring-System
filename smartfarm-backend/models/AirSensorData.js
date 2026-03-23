const mongoose = require("mongoose");

const AirSensorSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    default: "ESP32_001"
  },

  // ✅ DHT11
  temperature_dht: {
    type: Number,
    required: true
  },

  humidity: {
    type: Number,
    required: true
  },

  // ✅ MQ135
  co2_ppm: {
    type: Number,
    required: true
  },

  nh3_ppm: {
    type: Number,
    required: true
  },

  // ✅ BH1750 Light Sensor
  light_lux: {
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