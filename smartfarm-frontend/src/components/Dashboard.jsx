import DashboardCard from "./DashboardCard";
import Charts from "./Charts";

function Dashboard({ data, history }) {
  // Get previous values from history
  const getPreviousValue = (dataKey) => {
    if (history && history.length > 1) {
      return history[history.length - 2]?.[dataKey] || null;
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* Sensor Cards Section */}
      <div>
        <h2 style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "32px",
          color: "#333",
        }}>Live Sensor Data</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
        }}>
          <DashboardCard
            title="Temperature"
            value={data.temperature_dht}
            unit="°C"
            variant="blue"
            prevValue={getPreviousValue("temperature")}
          />
          <DashboardCard
            title="Humidity"
            value={data.humidity}
            unit="%"
            variant="purple"
            prevValue={getPreviousValue("humidity")}
          />
          <DashboardCard
            title="CO₂"
            value={data.co2_ppm}
            unit="ppm"
            variant="green"
            prevValue={getPreviousValue("co2")}
          />
          <DashboardCard
            title="NH₃"
            value={data.nh3_ppm}
            unit="ppm"
            variant="orange"
            prevValue={getPreviousValue("nh3")}
          />
          <DashboardCard
            title="Pressure"
            value={data.pressure}
            unit="hPa"
            variant="pink"
            prevValue={getPreviousValue("pressure")}
          />
          <DashboardCard
            title="Air Quality"
            value={data.air_quality_status}
            unit=""
            variant="red"
            prevValue={null}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        marginTop: "64px",
        paddingTop: "48px",
        borderTop: "4px solid #e5e7eb",
      }}>
        <h2 style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "32px",
          color: "#333",
        }}>Historical Data</h2>
        <div style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        }}>
          <Charts history={history} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;