import { useEffect, useState } from "react";
import { getLatestData } from "../services/api";
import Dashboard from "../components/Dashboard";

function Home() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await getLatestData();

      // If no data in DB yet
      if (!res.data) return;

      const latest = res.data;
      setData(latest);

      // Update chart history (last 10 points)
      setHistory((prev) => [
        ...prev.slice(-9),
        {
          time: new Date(latest.timestamp).toLocaleTimeString(),
          temperature: latest.temperature_dht,
          humidity: latest.humidity,
          co2: latest.co2_ppm,
          nh3: latest.nh3_ppm,
          pressure: latest.pressure,
        },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // If database still empty
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Waiting for sensor data from backend...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        🌱 Smart Farm Live Dashboard
      </h1>

      <Dashboard data={data} history={history} />
    </div>
  );
}

export default Home;