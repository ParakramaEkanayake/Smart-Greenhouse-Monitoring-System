require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const sensorRoutes = require("./routes/sensorRoutes");
const startMQTT = require("./mqtt/mqttClient");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/data", sensorRoutes);

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

startMQTT(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});