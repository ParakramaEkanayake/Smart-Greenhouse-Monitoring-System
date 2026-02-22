const mqtt = require("mqtt");
const SensorData = require("../models/SensorData");

let io;

const startMQTT = (socketIoInstance) => {
  io = socketIoInstance;

  const client = mqtt.connect("mqtt://broker.hivemq.com");

  client.on("connect", () => {
    console.log("MQTT Connected");
    client.subscribe("smartfarm/soil");
  });

  client.on("message", async (topic, message) => {
    const data = JSON.parse(message.toString());

    const saved = await SensorData.create({
      deviceId: data.deviceId,
      soilMoisture: data.soilMoisture
    });

    io.emit("newData", saved);
  });
};

module.exports = startMQTT;