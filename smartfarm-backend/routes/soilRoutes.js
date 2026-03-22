const express = require("express");
const router = express.Router();
const SoilMoistureData = require("../models/SoilMoistureData");

router.get("/latest", async (req, res) => {
  try {
    const latest = await SoilMoistureData.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;