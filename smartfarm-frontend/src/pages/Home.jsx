import { useEffect, useState } from "react";
import {
  getLatestAirData,
  getAirHistory,
  getLatestSoilData,
  getSoilHistory,
  getWaterPrediction,
} from "../services/api";

import Dashboard from "../components/Dashboard";
import Charts from "../components/Charts";
import ThresholdSettings from "./ThresholdSettings";
import { checkSensorStatus } from "../utils/statusUtils";

const defaultThresholds = {
  temperature: { min: 15, max: 30 },
  humidity: { min: 40, max: 70 },
  co2: { min: 0, max: 800 },
  // nh3: { min: 0, max: 50 },
  light: { min: 100, max: 1000 },   // ✅ ADD LIGHT
  soilMoisture: { min: 35, max: 65 },
};

const defaultFarmSettings = {
  plantAgeDays: 1,
  cropType: "Capsicum",
};

function Home() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [airData, setAirData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [airHistory, setAirHistory] = useState([]);
  const [soilHistory, setSoilHistory] = useState([]);
  const [waterPrediction, setWaterPrediction] = useState(null);
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [farmSettings, setFarmSettings] = useState(defaultFarmSettings);

  // ✅ Load thresholds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sensorThresholds");
    if (saved) setThresholds(JSON.parse(saved));

    const savedFarmSettings = localStorage.getItem("farmSettings");
    if (savedFarmSettings) setFarmSettings(JSON.parse(savedFarmSettings));

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

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
            // nh3: item.nh3_ppm,
            light: item.light_lux,   // ✅ ADD LIGHT
          }))
      );

      setSoilHistory(
        soilHist.data
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),  // ✅ ADD THIS
            soilMoisture: item.soilMoisture,
          }))
      );

      try {
        const currentFarmSettings = JSON.parse(
          localStorage.getItem("farmSettings") ||
            JSON.stringify(defaultFarmSettings)
        );
        const waterPred = await getWaterPrediction({
          crop: currentFarmSettings.cropType,
          day: currentFarmSettings.plantAgeDays,
        });
        setWaterPrediction(waterPred.data);
      } catch (predictionError) {
        console.error("Error fetching water prediction:", predictionError);
        setWaterPrediction(null);
      }
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

  const handleFarmSettingsSave = (newFarmSettings) => {
    localStorage.setItem("farmSettings", JSON.stringify(newFarmSettings));
    setFarmSettings(newFarmSettings);
    fetchData();
  };

  if (!airData && !soilData)
    return <div>Waiting for sensor data...</div>;

  const theme = {
    pageBg: isDarkMode ? "#0f172a" : "#f5f7fb",
    sidebarBg: isDarkMode
      ? "linear-gradient(135deg, #0f177a, #042f2e)"
      : "linear-gradient(135deg, #cbe6ef, #0f766e)",
    text: isDarkMode ? "#e5e7eb" : "#1f2937",
    muted: isDarkMode ? "#94a3b8" : "#6b7280",
    cardBg: isDarkMode ? "#111827" : "#ffffff",
    cardBorder: isDarkMode ? "#1f2937" : "#e5e7eb",
    softBg: isDarkMode ? "#1e293b" : "#ffffff",
    inputBg: isDarkMode ? "#0f172a" : "#ffffff",
  };

  const sensors = [
    {
      name: "Temperature",
      value: airData?.temperature_dht,
      thresholds: thresholds.temperature,
    },
    {
      name: "Humidity",
      value: airData?.humidity,
      thresholds: thresholds.humidity,
    },
    {
      name: "CO2",
      value: airData?.co2_ppm,
      thresholds: thresholds.co2,
    },
    {
      name: "Light",
      value: airData?.light_lux,
      thresholds: thresholds.light,
    },
    {
      name: "Soil",
      value: soilData?.soilMoisture,
      thresholds: thresholds.soilMoisture,
    },
  ];

  const statusGroups = {
    normal: [],
    warning: [],
    critical: [],
  };

  sensors.forEach((sensor) => {
    const status = checkSensorStatus(Number(sensor.value), sensor.thresholds);
    if (statusGroups[status]) statusGroups[status].push(sensor);
  });

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
        : theme.sidebarBg,
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
    <div
      style={{
        minHeight: "100vh",
        background: theme.pageBg,
        color: theme.text,
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >

      {/* ✅ Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: "240px",
            height: "100vh",
            background: theme.sidebarBg,
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "30px",
            }}
          >
            <img
              src="/logo-removebg-preview.png"
              alt="Smart Farm logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
              }}
            />
            <h2 style={{ margin: 0 }}>PolyAnalytics</h2>
          </div>
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

          <div
            style={{
              marginTop: "22px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              paddingBottom: "84px",
            }}
          >
            <SidebarStatusCard
              label="Normal"
              value={statusGroups.normal.length}
              color="#22c55e"
            />
            <SidebarStatusCard
              label="Warning"
              value={statusGroups.warning.length}
              color="#f59e0b"
            />
            <SidebarStatusCard
              label="Critical"
              value={statusGroups.critical.length}
              color="#ef4444"
            />
            <SidebarStatusCard
              label="Online"
              value={sensors.length}
              color="#3b82f6"
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: "20px",
              right: "20px",
              bottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: "700" }}>
              Dark Mode
            </span>
            <button
              type="button"
              aria-pressed={isDarkMode}
              aria-label="Toggle dark mode"
              onClick={() => setIsDarkMode((current) => !current)}
              style={{
                width: "44px",
                height: "24px",
                padding: "2px",
                border: "none",
                borderRadius: "999px",
                background: isDarkMode
                  ? "rgba(34,197,94,0.95)"
                  : "rgba(255,255,255,0.38)",
                cursor: "pointer",
                display: "flex",
                justifyContent: isDarkMode ? "flex-end" : "flex-start",
                alignItems: "center",
                transition: "background 0.2s ease",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  display: "block",
                }}
              />
            </button>
          </div>
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
            background: theme.sidebarBg,
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
            waterPrediction={waterPrediction}
            airHistory={airHistory}
            soilHistory={soilHistory}
            thresholds={thresholds}
            farmSettings={farmSettings}
            isDarkMode={isDarkMode}
            theme={theme}
          />
        )}

        {activePage === "charts" && (
          <Charts
            airHistory={airHistory}
            soilHistory={soilHistory}
            isDarkMode={isDarkMode}
          />
        )}

        {activePage === "settings" && (
          <ThresholdSettings
            thresholds={thresholds}
            onSave={handleThresholdSave}
            farmSettings={farmSettings}
            onFarmSettingsSave={handleFarmSettingsSave}
            isDarkMode={isDarkMode}
            theme={theme}
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

function SidebarStatusCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.16)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: "12px",
        padding: "10px",
        minHeight: "62px",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          lineHeight: 1,
          fontWeight: "800",
          color,
          textShadow: "0 1px 10px rgba(0,0,0,0.18)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: "6px",
          fontSize: "12px",
          fontWeight: "700",
          color: "white",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default Home;
