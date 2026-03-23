import { useState } from "react";

function ThresholdSettings({ thresholds, onSave }) {
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [saved, setSaved] = useState(false);

  /* ✅ UPDATED COLOR SCHEME */
  const sensorColors = {
    temperature: "#3b82f6",
    humidity: "#8b5cf6",
    co2: "#10b981",
    nh3: "#f59e0b",
    light: "#eab308",          // ✅ ADD LIGHT
    soilMoisture: "#059669",
  };

  /* ✅ UPDATED SENSOR NAMES */
  const sensorNames = {
    temperature: "🌡️ Temperature",
    humidity: "💧 Humidity",
    co2: "🌬️ CO₂",
    nh3: "⚠️ NH₃",
    light: "💡 Light Intensity",  // ✅ ADD LIGHT
    soilMoisture: "🌱 Soil Moisture",
  };

  const handleChange = (sensor, type, value) => {
    setLocalThresholds({
      ...localThresholds,
      [sensor]: {
        ...localThresholds[sensor],
        [type]: Number(value),
      },
    });
  };

  const handleSave = () => {
    localStorage.setItem(
      "sensorThresholds",
      JSON.stringify(localThresholds)
    );
    onSave(localThresholds);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ✅ UPDATED RESET DEFAULTS */
  const handleReset = () => {
    const defaults = {
      temperature: { min: 15, max: 30 },
      humidity: { min: 40, max: 70 },
      co2: { min: 0, max: 800 },
      nh3: { min: 0, max: 50 },
      light: { min: 100, max: 1000 },   // ✅ ADD LIGHT DEFAULT
      soilMoisture: { min: 35, max: 65 },
    };
    setLocalThresholds(defaults);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* ✅ PAGE HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              marginLeft: "70px",
              fontSize: "36px",
              fontWeight: "700",
              color: "#1f2937",
            }}
          >
            ⚙ Threshold Settings
          </h1>
        </div>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Define safe operating ranges for each sensor.
        </p>
      </div>

      {/* ✅ THRESHOLD CARDS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {Object.keys(localThresholds).map((sensor) => (
          <div
            key={sensor}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              borderLeft: `5px solid ${sensorColors[sensor]}`,
              transition: "all 0.2s ease",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {sensorNames[sensor]}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* MIN */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={localThresholds[sensor].min}
                  onChange={(e) =>
                    handleChange(sensor, "min", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "16px",
                  }}
                />
              </div>

              {/* MAX */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={localThresholds[sensor].max}
                  onChange={(e) =>
                    handleChange(sensor, "max", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            {/* ✅ SAFE RANGE PREVIEW */}
            <div
              style={{
                marginTop: "16px",
                padding: "10px 14px",
                background: `${sensorColors[sensor]}15`,
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                color: sensorColors[sensor],
              }}
            >
              ✅ Safe Range: {localThresholds[sensor].min} →{" "}
              {localThresholds[sensor].max}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ ACTION BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            padding: "14px 28px",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            background: "#a8d38d",
            color: "#4b5563",
          }}
        >
          Reset Defaults
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: "14px 36px",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            background: saved
              ? "#22c55e"
              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
          }}
        >
          {saved ? "✅ Saved Successfully!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default ThresholdSettings;