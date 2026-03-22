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