const mqtt = require("mqtt");
const SoilSensor2Data = require("../models/SoilSensor2Data");

const startSoilSensor2Mqtt = () => {
  const client = mqtt.connect(process.env.MQTT_BROKER);

  client.on("connect", () => {
    console.log("YL-69 Soil MQTT Connected");
    client.subscribe(process.env.MQTT_TOPIC_SOIL2);
  });

  client.on("message", async (topic, message) => {
    console.log("Received message on topic:", topic, message.toString());
    if (topic === process.env.MQTT_TOPIC_SOIL2) {
      try {
        const data = JSON.parse(message.toString());

        const saved = await SoilSensor2Data.create({
          deviceId: data.deviceId,
          soilMoisture: data.soilMoisture
        });

        console.log("YL-69 Soil Data saved:", saved);
      } catch (err) {
        console.log("YL-69 MQTT parse/save error:", err.message);
      }
    }
  });
};

module.exports = startSoilSensor2Mqtt;