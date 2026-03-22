import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Charts({ airHistory }) {
  const chartConfigs = [
    {
      title: "🌡️ Temperature Trends",
      dataKey: "temperature",
      color: "#ef4444",
      unit: "°C",
      bgColor: "#fee2e2",
    },
    {
      title: "💧 Humidity Trends",
      dataKey: "humidity",
      color: "#3b82f6",
      unit: "%",
      bgColor: "#dbeafe",
    },
    {
      title: "🌫️ CO₂ Trends",
      dataKey: "co2",
      color: "#10b981",
      unit: "ppm",
      bgColor: "#d1fae5",
    },
    {
      title: "🔬 NH₃ Trends",
      dataKey: "nh3",
      color: "#f59e0b",
      unit: "ppm",
      bgColor: "#fef3c7",
    },
    {
      title: "🔌 Pressure Trends",
      dataKey: "pressure",
      color: "#8b5cf6",
      unit: "hPa",
      bgColor: "#ede9fe",
    },
    {
      title: "🌱 Soil Moisture Trends",
      dataKey: "soilMoisture",
      color: "#059669",
      unit: "%",
      bgColor: "#dcfce7",
    },
  ];

  // If no history yet
  if (!airHistory || airHistory.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          fontSize: "18px",
          color: "#666",
          fontWeight: "600",
        }}
      >
        No historical data available yet...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {chartConfigs.map((config, index) => (
        <div
          key={index}
          style={{
            background: config.bgColor,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "16px",
              color: config.color,
              textAlign: "center",
            }}
          >
            {config.title}
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={airHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: "#666" }}
              />
              
              <YAxis
                tick={{ fontSize: 12, fill: "#666" }}
                label={{
                  value: config.unit,
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: `2px solid ${config.color}`,
                  borderRadius: "8px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                }}
                formatter={(value) => [
                  value !== null && value !== undefined && !isNaN(value)
                    ? `${Number(value).toFixed(2)} ${config.unit}`
                    : "No Data",
                  config.title,
                ]}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={3}
                dot={{ fill: config.color, r: 4 }}
                activeDot={{ r: 6 }}
                name={config.title}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

export default Charts;