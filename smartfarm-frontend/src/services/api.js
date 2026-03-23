import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// -------------------
// AIR SENSOR DATA
// -------------------
export const getLatestAirData = () => API.get("/air/latest");
export const getAirHistory = () => API.get("/air/history");

// -------------------
// SOIL MOISTURE DATA
// -------------------
export const getLatestSoilData = () => API.get("/soil/latest");
export const getSoilHistory = () => API.get("/soil/history");

// Existing functions...

// Get thresholds
export const getThresholds = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/thresholds', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching thresholds:", error);
    return null;
  }
};

// Save thresholds
export const saveThresholds = async (thresholds) => {
  try {
    const response = await fetch('http://localhost:5000/api/thresholds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thresholds)
    });
    return response.json();
  } catch (error) {
    console.error("Error saving thresholds:", error);
    throw error;
  }
};