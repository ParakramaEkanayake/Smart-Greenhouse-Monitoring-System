import { useState } from "react";
import DashboardCard from "./DashboardCard";
import Charts from "./Charts";

function Dashboard({ data, history }) {
  const [activeSection, setActiveSection] = useState("sensors");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get previous values from history
  const getPreviousValue = (dataKey) => {
    if (history && history.length > 1) {
      return history[history.length - 2]?.[dataKey] || null;
    }
    return null;
  };

  const navItemStyle = (isActive) => ({
    padding: "16px 20px",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 300ms ease",
    background: isActive
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    width: "100%",
    textAlign: "left",
    boxShadow: isActive ? "0 5px 15px rgba(16, 185, 129, 0.3)" : "none",
  });

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      gap: "0",
    }}>
      {/* Hamburger/Back Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          left: sidebarOpen ? "210px" : "16px",
          top: "24px",
          zIndex: 1000,
          width: "48px",
          height: "48px",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 300ms ease",
          boxShadow: "0 5px 15px rgba(16, 185, 129, 0.3)",
        }}
        title={sidebarOpen ? "Close Menu" : "Open Menu"}
      >
        {sidebarOpen ? (
          // Back Arrow Icon
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "transform 300ms ease",
            }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        ) : (
          // Hamburger Icon
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            transition: "all 300ms ease",
          }}>
            <div style={{
              width: "24px",
              height: "3px",
              background: "#ffffff",
              borderRadius: "2px",
              transition: "all 300ms ease",
            }}></div>
            <div style={{
              width: "24px",
              height: "3px",
              background: "#ffffff",
              borderRadius: "2px",
              transition: "all 300ms ease",
            }}></div>
            <div style={{
              width: "24px",
              height: "3px",
              background: "#ffffff",
              borderRadius: "2px",
              transition: "all 300ms ease",
            }}></div>
          </div>
        )}
      </button>

      {/* Left Sidebar Navigation */}
      {sidebarOpen && (
        <div style={{
          width: "200px",
          background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
          padding: "32px 16px",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
          height: "100vh",
          position: "fixed",
          left: "0",
          top: "0",
          overflowY: "auto",
          zIndex: 999,
        }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: "24px",
            marginTop: "80px",
            textAlign: "center",
          }}>
          </h3>
          <button
            onClick={() => setActiveSection("sensors")}
            style={navItemStyle(activeSection === "sensors")}
            onMouseEnter={(e) => {
              if (activeSection !== "sensors") {
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== "sensors") {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }
            }}
          >
            Live Sensor Data
          </button>
          <button
            onClick={() => setActiveSection("charts")}
            style={navItemStyle(activeSection === "charts")}
            onMouseEnter={(e) => {
              if (activeSection !== "charts") {
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== "charts") {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }
            }}
          >
            Historical Charts
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          marginLeft: sidebarOpen ? "200px" : "0",
          padding: "80px 32px 32px 32px",
          transition: "margin-left 300ms ease",
        }}
      >
        {/* Dashboard Title */}
        <div style={{
          textAlign: "center",
          marginBottom: "32px",
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0",
            letterSpacing: "2px",
          }}>
            🌾 Smart Farm Dashboard
          </h1>
          <p style={{
            fontSize: "16px",
            color: "#aaaaaa",
            marginTop: "12px",
            fontStyle: "italic",
          }}>
            Real-time Sensor Monitoring & Historical Analytics
          </p>
        </div>

        {/* Sensor Cards Section */}
        {activeSection === "sensors" && (
          <div>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "700",
                marginBottom: "32px",
                color: "#ffffff",
              }}
            >
              Live Sensor Data
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "32px",
              }}
            >
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
        )}

        {/* Charts Section */}
        {activeSection === "charts" && (
          <div>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "700",
                marginBottom: "32px",
                color: "#ffffff",
              }}
            >
              Historical Data
            </h2>
            <div
              style={{
                background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Charts history={history} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;