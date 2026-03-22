const express = require("express");
const router = express.Router();
const AirSensorData = require("../models/AirSensorData");

router.get("/latest", async (req, res) => {
  try {
    const latest = await AirSensorData.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;