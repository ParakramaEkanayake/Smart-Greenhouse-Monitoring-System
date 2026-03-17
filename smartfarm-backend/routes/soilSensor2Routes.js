const express = require("express");
const router = express.Router();
const SoilSensor2Data = require("../models/SoilSensor2Data");

router.get("/", async (req, res) => {
  const data = await SoilSensor2Data.find()
    .sort({ timestamp: -1 })
    .limit(50);

  res.json(data);
});

module.exports = router;