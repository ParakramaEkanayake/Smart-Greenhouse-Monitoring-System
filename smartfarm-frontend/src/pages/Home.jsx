import { useEffect, useState } from "react";
import {
  getLatestAirData,
  getAirHistory,
  getLatestSoilData,
  getSoilHistory,
} from "../services/api";
import Dashboard from "../components/Dashboard";

function Home() {
  const [airData, setAirData] = useState(null);
  const [soilData, setSoilData] = useState(null);

  const [airHistory, setAirHistory] = useState([]);
  const [soilHistory, setSoilHistory] = useState([]);

  useEffect(() => {
    fetchData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [airLatestRes, airHistoryRes, soilLatestRes, soilHistoryRes] =
        await Promise.all([
          getLatestAirData(),
          getAirHistory(),
          getLatestSoilData(),
          getSoilHistory(),
        ]);

      // Latest air data
      if (airLatestRes.data) {
        setAirData(airLatestRes.data);
      }

      // Latest soil data
      if (soilLatestRes.data) {
        setSoilData(soilLatestRes.data);
      }

      // Air history for charts
      if (airHistoryRes.data && Array.isArray(airHistoryRes.data)) {
        const formattedAirHistory = airHistoryRes.data
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            temperature: item.temperature_dht,
            humidity: item.humidity,
            co2: item.co2_ppm,
            nh3: item.nh3_ppm,
            pressure: item.pressure,
          }));

        setAirHistory(formattedAirHistory);
      }

      // Soil history for charts
      if (soilHistoryRes.data && Array.isArray(soilHistoryRes.data)) {
        const formattedSoilHistory = soilHistoryRes.data
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            soilMoisture: item.soilMoisture,
          }));

        setSoilHistory(formattedSoilHistory);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // If database still empty
  if (!airData && !soilData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Waiting for sensor data from backend...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <Dashboard
        airData={airData}
        soilData={soilData}
        airHistory={airHistory}
        soilHistory={soilHistory}
      />
    </div>
  );
}

export default Home;