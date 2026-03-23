const mqtt = require("mqtt");
const AirSensorData = require("../models/AirSensorData");
const SoilMoistureData = require("../models/SoilMoistureData");

let io;

const startMQTT = (socketIoInstance) => {
  io = socketIoInstance;

  const client = mqtt.connect("mqtt://broker.hivemq.com");

  client.on("connect", () => {
    console.log("✅ MQTT Connected");

    client.subscribe("smartfarm/airdata");
    client.subscribe("smartfarm/soilmoisture");

    console.log("✅ Subscribed to smartfarm/airdata");
    console.log("✅ Subscribed to smartfarm/soilmoisture");
  });

  client.on("message", async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());

      /* ✅ AIR SENSOR DATA */
      if (topic === "smartfarm/airdata") {
        const savedAir = await AirSensorData.create({
          deviceId: data.deviceId || "ESP32_001",

          // ✅ DHT11
          temperature_dht: data.temperature_dht,
          humidity: data.humidity,

          // ✅ MQ135
          co2_ppm: data.co2_ppm,
          nh3_ppm: data.nh3_ppm,

          // ✅ BH1750 Light Sensor
          light_lux: data.light_lux,

          air_quality_status: data.air_quality_status,
        });

        console.log("✅ Air data saved:", savedAir);

        if (io) {
          io.emit("newAirData", savedAir);
        }

      /* ✅ SOIL SENSOR DATA */
      } else if (topic === "smartfarm/soilmoisture") {

        const savedSoil = await SoilMoistureData.create({
          deviceId: data.deviceId || "ESP32_002",
          soilMoisture: data.soilMoisture
        });

        console.log("✅ Soil moisture data saved:", savedSoil);

        if (io) {
          io.emit("newSoilData", savedSoil);
        }
      }

    } catch (error) {
      console.error("❌ MQTT Message Error:", error.message);
    }
  });
};

module.exports = startMQTT;