import { useState } from "react";
import DashboardCard from "./DashboardCard";
import Charts from "./Charts";
import { checkSensorStatus } from "../utils/statusUtils";

function Dashboard({
  airData,
  soilData,
  airHistory,
  soilHistory,
  thresholds,
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

  /* ✅ SENSOR LIST */
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
    {
      name: "NH₃",
      value: airData?.nh3_ppm,
      thresholds: thresholds.nh3,
    },
    {
      name: "Pressure",
      value: airData?.pressure,
      thresholds: thresholds.pressure,
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
            color: "#1f2937",
          }}
        >
          🌾 Smart Farm Dashboard
        </h1>
      </div>

      {/* ✅ SYSTEM STATUS SUMMARY WITH HOVER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatusBox
          label="Normal"
          sensors={statusGroups.normal}
          color="#22c55e"
        />
        <StatusBox
          label="Warning"
          sensors={statusGroups.warning}
          color="#f59e0b"
        />
        <StatusBox
          label="Critical"
          sensors={statusGroups.critical}
          color="#ef4444"
        />
        <StatusBox
          label="Sensors Online"
          sensors={sensors}
          color="#3b82f6"
        />
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
            Critical Alert ({statusGroups.critical.length})
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
          />

          <DashboardCard
            title="Humidity"
            value={airData?.humidity ?? "--"}
            unit="%"
            prevValue={getPreviousAirValue("humidity")}
            thresholds={thresholds.humidity}
          />

          <DashboardCard
            title="CO₂"
            value={airData?.co2_ppm ?? "--"}
            unit="ppm"
            prevValue={getPreviousAirValue("co2")}
            thresholds={thresholds.co2}
          />

          <DashboardCard
            title="NH₃"
            value={airData?.nh3_ppm ?? "--"}
            unit="ppm"
            prevValue={getPreviousAirValue("nh3")}
            thresholds={thresholds.nh3}
          />

          <DashboardCard
            title="Pressure"
            value={airData?.pressure ?? "--"}
            unit="hPa"
            prevValue={getPreviousAirValue("pressure")}
            thresholds={thresholds.pressure}
          />

          <DashboardCard
            title="Soil Moisture"
            value={soilData?.soilMoisture ?? "--"}
            unit="%"
            prevValue={getPreviousSoilValue("soilMoisture")}
            thresholds={thresholds.soilMoisture}
          />
        </div>
      )}

      {activeSection === "charts" && (
        <Charts airHistory={airHistory} soilHistory={soilHistory} />
      )}
    </div>
  );
}

/* ✅ STATUS BOX WITH HOVER */
function StatusBox({ label, sensors, color }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        borderTop: `5px solid ${color}`,
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
          color: "#6b7280",
        }}
      >
        {label}
      </p>

      {/* ✅ GLASS HOVER POPUP */}
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
            background: "rgba(255, 255, 255, 0.25)",
            border: `1px solid rgba(255,255,255,0.4)`,
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease-in-out",
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
                color: "#1f2937",
                display: "flex",
                justifyContent: "space-between",
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