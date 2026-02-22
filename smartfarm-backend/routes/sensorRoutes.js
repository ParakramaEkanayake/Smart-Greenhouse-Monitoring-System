const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");

router.get("/", async (req, res) => {
  const data = await SensorData.find()
    .sort({ timestamp: -1 })
    .limit(50);

  res.json(data);
});

module.exports = router;