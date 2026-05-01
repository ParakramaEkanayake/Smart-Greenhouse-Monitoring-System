const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const AirSensorData = require("../models/AirSensorData");
const SoilMoistureData = require("../models/SoilMoistureData");

const router = express.Router();

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_CROP = "Capsicum";

const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / ONE_DAY_MS);
};

const round = (value, digits = 2) => Number(Number(value).toFixed(digits));

const getAirAverages = (since) =>
  AirSensorData.aggregate([
    { $match: { timestamp: { $gte: since } } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        temperature: { $avg: "$temperature_dht" },
        humidity: { $avg: "$humidity" },
        co2_ppm: { $avg: "$co2_ppm" },
        light_lux: { $avg: "$light_lux" },
      },
    },
  ]);

const getSoilAverages = (since) =>
  SoilMoistureData.aggregate([
    { $match: { timestamp: { $gte: since } } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        soil_moisture: { $avg: "$soilMoisture" },
      },
    },
  ]);

const runPrediction = (input) =>
  new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "..", "model", "predict_water.py");
    const pythonCommand = process.env.PYTHON_PATH || "python";

    execFile(
      pythonCommand,
      [scriptPath, JSON.stringify(input)],
      { timeout: 30000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (parseError) {
          reject(parseError);
        }
      }
    );
  });

router.get("/predict", async (req, res) => {
  try {
    const now = new Date();
    const since = new Date(now.getTime() - ONE_DAY_MS);
    const crop = req.query.crop || DEFAULT_CROP;
    const day = Number(req.query.day || getDayOfYear(now));

    if (!Number.isInteger(day) || day <= 0) {
      return res.status(400).json({ error: "day must be a positive integer" });
    }

    const [airResults, soilResults] = await Promise.all([
      getAirAverages(since),
      getSoilAverages(since),
    ]);

    const airAverage = airResults[0];
    const soilAverage = soilResults[0];

    if (!airAverage || !soilAverage) {
      return res.status(404).json({
        error: "Not enough sensor data from the past 24 hours to predict water release.",
        window: {
          from: since,
          to: now,
        },
        records: {
          air: airAverage?.count || 0,
          soil: soilAverage?.count || 0,
        },
      });
    }

    const modelInput = {
      day,
      crop,
      soil_moisture: soilAverage.soil_moisture,
      co2_ppm: airAverage.co2_ppm,
      light_lux: airAverage.light_lux,
      humidity: airAverage.humidity,
      temperature: airAverage.temperature,
    };

    const result = await runPrediction(modelInput);

    res.json({
      waterReleasePerDay: round(result.prediction),
      unit: "model output",
      crop,
      day,
      window: {
        from: since,
        to: now,
        hours: 24,
      },
      records: {
        air: airAverage.count,
        soil: soilAverage.count,
      },
      averages: {
        temperature: round(airAverage.temperature),
        humidity: round(airAverage.humidity),
        co2_ppm: round(airAverage.co2_ppm),
        light_lux: round(airAverage.light_lux),
        light_umol_m2_s: round(result.derived.light_umol_m2_s),
        lux_to_umol_factor: result.derived.lux_to_umol_factor,
        soil_moisture: round(soilAverage.soil_moisture),
      },
      model: {
        cropSeenDuringTraining: result.derived.crop_seen_during_training,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message.trim() });
  }
});

module.exports = router;
