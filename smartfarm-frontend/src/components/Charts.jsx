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

function Charts({ history }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        📊 Live Sensor Trends
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={3}
            name="Temperature (°C)"
          />

          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Humidity (%)"
          />

          <Line
            type="monotone"
            dataKey="co2"
            stroke="#10b981"
            strokeWidth={3}
            name="CO₂ (ppm)"
          />

          <Line
            type="monotone"
            dataKey="nh3"
            stroke="#f59e0b"
            strokeWidth={3}
            name="NH₃ (ppm)"
          />

          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#8b5cf6"
            strokeWidth={3}
            name="Pressure (hPa)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;