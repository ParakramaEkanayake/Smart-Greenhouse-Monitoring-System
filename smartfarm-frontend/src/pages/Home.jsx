import { useEffect, useState } from "react";
import {
  getLatestAirData,
  getAirHistory,
  getLatestSoilData,
  getSoilHistory,
} from "../services/api";

import Dashboard from "../components/Dashboard";
import Charts from "../components/Charts";
import ThresholdSettings from "./ThresholdSettings";

const defaultThresholds = {
  temperature: { min: 15, max: 30 },
  humidity: { min: 40, max: 70 },
  co2: { min: 0, max: 800 },
  nh3: { min: 0, max: 50 },
  light: { min: 100, max: 1000 },   // ✅ ADD LIGHT
  soilMoisture: { min: 35, max: 65 },
};

function Home() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [airData, setAirData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [airHistory, setAirHistory] = useState([]);
  const [soilHistory, setSoilHistory] = useState([]);
  const [thresholds, setThresholds] = useState(defaultThresholds);

  // ✅ Load thresholds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sensorThresholds");
    if (saved) setThresholds(JSON.parse(saved));

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [airLatest, airHist, soilLatest, soilHist] =
        await Promise.all([
          getLatestAirData(),
          getAirHistory(),
          getLatestSoilData(),
          getSoilHistory(),
        ]);

      setAirData(airLatest.data);
      setSoilData(soilLatest.data);

      setAirHistory(
        airHist.data
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            temperature: item.temperature_dht,
            humidity: item.humidity,
            co2: item.co2_ppm,
            nh3: item.nh3_ppm,
            light: item.light_lux,   // ✅ ADD LIGHT
          }))
      );

      setSoilHistory(
        soilHist.data.reverse().map((item) => ({
          soilMoisture: item.soilMoisture,
        }))
      );
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  const handleThresholdSave = (newThresholds) => {
    localStorage.setItem(
      "sensorThresholds",
      JSON.stringify(newThresholds)
    );
    setThresholds(newThresholds);
  };

  if (!airData && !soilData)
    return <div>Waiting for sensor data...</div>;

  const getNavStyle = (page) => ({
    display: "block",
    width: "100%",
    padding: "14px 18px",
    marginBottom: "14px",
    borderRadius: "14px",
    border: activePage === page
      ? "1px solid rgba(255,255,255,0.6)"
      : "1px solid ",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: activePage === page ? "#065f46" : "white",
    background:
      activePage === page
        ? "rgba(255,255,255,0.9)"
        : "linear-gradient(135deg, #14b8a6, #0f766e)",
    backdropFilter:
      activePage === page ? "blur(10px)" : "none",
    WebkitBackdropFilter:
      activePage === page ? "blur(10px)" : "none",
    boxShadow:
      activePage === page
        ? "0 6px 18px rgba(0,0,0,0.15)"
        : "none",
  });

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ✅ Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: "240px",
            height: "100vh",
            background: "linear-gradient(135deg, #14b8a6, #0f766e)",
            color: "white",
            padding: "30px 20px",
            position: "fixed",     // ✅ Important
            top: 0,
            left: 0,
            overflowY: "auto",     // optional (if sidebar content is long)
            boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          <h2 style={{ marginBottom: "30px" }}>🌾 Smart Farm</h2>

          <button
            onClick={() => setActivePage("dashboard")}
            style={getNavStyle("dashboard")}
            onMouseEnter={(e) => {
              if (activePage !== "dashboard") {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                e.currentTarget.style.backdropFilter = "blur(12px)";
                e.currentTarget.style.WebkitBackdropFilter = "blur(12px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== "dashboard") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.backdropFilter = "none";
                e.currentTarget.style.WebkitBackdropFilter = "none";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            Live Sensors
          </button>

          <button
            onClick={() => setActivePage("charts")}
            style={getNavStyle("charts")}
            onMouseEnter={(e) => {
              if (activePage !== "charts") {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                e.currentTarget.style.backdropFilter = "blur(12px)";
                e.currentTarget.style.WebkitBackdropFilter = "blur(12px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== "charts") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.backdropFilter = "none";
                e.currentTarget.style.WebkitBackdropFilter = "none";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            Charts
          </button>

          <button
            onClick={() => setActivePage("settings")}
            style={getNavStyle("settings")}
            onMouseEnter={(e) => {
              if (activePage !== "settings") {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                e.currentTarget.style.backdropFilter = "blur(12px)";
                e.currentTarget.style.WebkitBackdropFilter = "blur(12px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== "settings") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.backdropFilter = "none";
                e.currentTarget.style.WebkitBackdropFilter = "none";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            Threshold Settings
          </button>
        </div>
      )}

      {/* ✅ Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "240px" : "0",
          padding: "25px 20px",
          transition: "margin-left 1s ease",
        }}
      >

        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: "28px",
            left: sidebarOpen ? "260px" : "24px",
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #14b8a6, #0f766e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 20px rgba(15, 118, 110, 0.4)",
            zIndex: 1000,
          }}
        >
          {sidebarOpen ? (
            /* ✅ Back Arrow Icon */
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "0.3s ease" }}
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          ) : (
            /* ✅ Hamburger Icon */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "3px",
                  background: "white",
                  borderRadius: "3px",
                }}
              />
              <div
                style={{
                  width: "22px",
                  height: "3px",
                  background: "white",
                  borderRadius: "3px",
                }}
              />
              <div
                style={{
                  width: "22px",
                  height: "3px",
                  background: "white",
                  borderRadius: "3px",
                }}
              />
            </div>
          )}
        </button>

        {activePage === "dashboard" && (
          <Dashboard
            airData={airData}
            soilData={soilData}
            airHistory={airHistory}
            soilHistory={soilHistory}
            thresholds={thresholds}
          />
        )}

        {activePage === "charts" && (
          <Charts
            airHistory={airHistory}
            soilHistory={soilHistory}
          />
        )}

        {activePage === "settings" && (
          <ThresholdSettings
            thresholds={thresholds}
            onSave={handleThresholdSave}
          />
        )}
      </div>
    </div>
  );
}

const navStyle = {
  display: "block",
  width: "100%",
  padding: "12px 16px",
  marginBottom: "12px",
  background: "rgba(255,255,255,0.2)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

export default Home;