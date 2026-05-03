import { useState } from "react";
import DashboardCard from "./DashboardCard";
import Charts from "./Charts";
import { checkSensorStatus } from "../utils/statusUtils";

function Dashboard({
  airData,
  soilData,
  waterPrediction,
  airHistory,
  soilHistory,
  thresholds,
  farmSettings,
  isDarkMode = false,
  theme,
}) {
  const [activeSection] = useState("sensors");

  const getPreviousAirValue = (key) => {
    if (airHistory.length > 1) {
      return airHistory[airHistory.length - 2][key];
    }
    return null;
  };

  const getPreviousSoilValue = (key) => {
    if (soilHistory.length > 1) {
      return soilHistory[soilHistory.length - 2][key];
    }
    return null;
  };

  /* ✅ UPDATED SENSOR LIST (Pressure removed, Light added) */
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
      name: "CO₂",
      value: airData?.co2_ppm,
      thresholds: thresholds.co2,
    },
    // {
    //   name: "NH₃",
    //   value: airData?.nh3_ppm,
    //   thresholds: thresholds.nh3,
    // },
    {
      name: "Light Intensity",
      value: airData?.light_lux,
      thresholds: thresholds.light,
    },
    {
      name: "Soil Moisture",
      value: soilData?.soilMoisture,
      thresholds: thresholds.soilMoisture,
    },
  ];

  /* ✅ GROUP SENSORS BY STATUS */
  const statusGroups = {
    normal: [],
    warning: [],
    critical: [],
  };

  sensors.forEach((sensor) => {
    const status = checkSensorStatus(
      Number(sensor.value),
      sensor.thresholds
    );

    if (statusGroups[status]) {
      statusGroups[status].push(sensor);
    }
  });

  const getThresholdMessage = (sensor) => {
    const value = Number(sensor.value);
    const { min, max } = sensor.thresholds || {};

    if (value < min) return `${sensor.name} is below the minimum threshold.`;
    if (value > max) return `${sensor.name} is above the maximum threshold.`;

    return `${sensor.name} is out of safe range.`;
  };

  const renderAlertSection = ({ title, sensors, colors }) => {
    if (sensors.length === 0) return null;

    return (
      <div
        style={{
          background: isDarkMode ? colors.darkBg : colors.bg,
          border: `1px solid ${isDarkMode ? colors.darkBorder : colors.border}`,
          padding: "20px",
          borderRadius: "16px",
          marginBottom: "30px",
          color: isDarkMode ? colors.darkText : colors.text,
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {title} ({sensors.length})
        </h3>

        {sensors.map((sensor, index) => (
          <p key={index} style={{ marginBottom: "8px" }}>
            {getThresholdMessage(sensor)} Current Value:{" "}
            <strong>{sensor.value}</strong>
            {/* , Safe Range:{" "} */}
            {/* <strong>
              {sensor.thresholds.min} - {sensor.thresholds.max}
            </strong> */}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* ✅ TITLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
          paddingLeft: "70px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            margin: 0,
            color: theme?.text || "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <img
            src="/logo-removebg-preview.png"
            alt="Smart Farm logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
            }}
          />
          PolyAnalytics Dashboard
        </h1>
      </div>

      {/* ✅ SYSTEM STATUS SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, #064e3b, #111827)"
              : "linear-gradient(135deg, #d1fae5, #ffffff)",
            borderRadius: "18px",
            padding: "28px 32px",
            boxShadow: isDarkMode
              ? "0 12px 34px rgba(0,0,0,0.38)"
              : "0 8px 24px rgba(5,150,105,0.18)",
            border: isDarkMode ? "1px solid #14532d" : "1px solid #a7f3d0",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              color: isDarkMode ? "#a7f3d0" : "#047857",
              fontSize: "15px",
              fontWeight: "700",
            }}
          >
            Water Release / Day
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span
              style={{
                fontSize: "56px",
                lineHeight: 1,
                fontWeight: "800",
                color: theme?.text || "#064e3b",
              }}
            >
              {waterPrediction?.waterReleasePerDay ?? "--"}
            </span>
            <span
              style={{
                color: theme?.muted || "#6b7280",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              per day
            </span>
          </div>
        </div>

        <div
          style={{
            background: theme?.cardBg || "#ffffff",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: isDarkMode
              ? "0 10px 28px rgba(0,0,0,0.35)"
              : "0 6px 20px rgba(0,0,0,0.06)",
            border: isDarkMode ? "1px solid #1f2937" : "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              color: theme?.muted || "#6b7280",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            Plant Age
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontSize: "34px",
                lineHeight: 1,
                fontWeight: "800",
                color: theme?.text || "#1f2937",
              }}
            >
              {farmSettings?.plantAgeDays ?? "--"}
            </span>
            <span
              style={{
                color: theme?.muted || "#6b7280",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              days
            </span>
          </div>
        </div>
      </div>

      {/* ✅ CRITICAL ALERT SECTION */}
      {statusGroups.critical.length > 0 && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "30px",
            color: "#991b1b",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            🚨 Critical Alert ({statusGroups.critical.length})
          </h3>

          {statusGroups.critical.map((sensor, index) => (
            <p key={index} style={{ marginBottom: "8px" }}>
              {sensor.name} is out of safe range.
              Current Value: <strong>{sensor.value}</strong>
            </p>
          ))}
        </div>
      )}

      {/* ✅ SENSOR CARDS */}
      {renderAlertSection({
        title: "Warning Alert",
        sensors: statusGroups.warning,
        colors: {
          bg: "#fef3c7",
          border: "#fde68a",
          text: "#92400e",
          darkBg: "rgba(120, 53, 15, 0.32)",
          darkBorder: "rgba(251, 191, 36, 0.45)",
          darkText: "#fde68a",
        },
      })}

      {activeSection === "sensors" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          <DashboardCard
            title="Temperature"
            value={airData?.temperature_dht ?? "--"}
            unit="°C"
            prevValue={getPreviousAirValue("temperature")}
            thresholds={thresholds.temperature}
            isDarkMode={isDarkMode}
          />

          <DashboardCard
            title="Humidity"
            value={airData?.humidity ?? "--"}
            unit="%"
            prevValue={getPreviousAirValue("humidity")}
            thresholds={thresholds.humidity}
            isDarkMode={isDarkMode}
          />

          <DashboardCard
            title="CO₂"
            value={airData?.co2_ppm ?? "--"}
            unit="ppm"
            prevValue={getPreviousAirValue("co2")}
            thresholds={thresholds.co2}
            isDarkMode={isDarkMode}
          />

          {/* <DashboardCard
            title="NH₃"
            value={airData?.nh3_ppm ?? "--"}
            unit="ppm"
            prevValue={getPreviousAirValue("nh3")}
            thresholds={thresholds.nh3}
          /> */}

          <DashboardCard
            title="Light Intensity"
            value={airData?.light_lux ?? "--"}
            unit="lux"
            prevValue={getPreviousAirValue("light")}
            thresholds={thresholds.light}
            isDarkMode={isDarkMode}
          />

          <DashboardCard
            title="Soil Moisture"
            value={soilData?.soilMoisture ?? "--"}
            unit="%"
            prevValue={getPreviousSoilValue("soilMoisture")}
            thresholds={thresholds.soilMoisture}
            isDarkMode={isDarkMode}
          />

        </div>
      )}

      {activeSection === "charts" && (
        <Charts
          airHistory={airHistory}
          soilHistory={soilHistory}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

/* ✅ STATUS BOX WITH HOVER */
function StatusBox({ label, sensors, color, isDarkMode, theme }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme?.cardBg || "white",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: isDarkMode
          ? "0 10px 28px rgba(0,0,0,0.35)"
          : "0 6px 20px rgba(0,0,0,0.05)",
        borderTop: `5px solid ${color}`,
        border: isDarkMode ? "1px solid #1f2937" : "none",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "32px",
          fontWeight: "700",
          color: color,
        }}
      >
        {sensors.length}
      </h2>

      <p
        style={{
          marginTop: "6px",
          fontWeight: "600",
          color: theme?.muted || "#6b7280",
        }}
      >
        {label}
      </p>

      {hovered && sensors.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "240px",
            padding: "18px",
            borderRadius: "16px",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            background: isDarkMode
              ? "rgba(15, 23, 42, 0.88)"
              : "rgba(255, 255, 255, 0.82)",
            border: isDarkMode
              ? "1px solid rgba(148,163,184,0.35)"
              : "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            zIndex: 999,
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: "700",
              color: color,
            }}
          >
            {label} Sensors
          </h4>

          {sensors.map((sensor, index) => (
            <div
              key={index}
              style={{
                fontSize: "13px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                color: theme?.text || "#1f2937",
              }}
            >
              <span>{sensor.name}</span>
              <strong>{sensor.value}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
