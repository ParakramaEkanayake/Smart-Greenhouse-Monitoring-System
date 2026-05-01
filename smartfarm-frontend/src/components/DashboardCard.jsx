import { motion } from "framer-motion";
import {
  checkSensorStatus,
  getStatusColor,
  getStatusLabel,
} from "../utils/statusUtils";

function DashboardCard({
  title,
  value,
  unit,
  variant = "blue",
  prevValue = null,
  thresholds,
  isDarkMode = false,
}) {
  const status = thresholds
    ? checkSensorStatus(Number(value), thresholds)
    : "normal";

  const statusColor = getStatusColor(status);

  const isIncreased =
    prevValue !== null && Number(value) > Number(prevValue);
  const isDecreased =
    prevValue !== null && Number(value) < Number(prevValue);

  const difference =
    prevValue !== null
      ? Math.abs(Number(value) - Number(prevValue)).toFixed(2)
      : null;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        background: isDarkMode ? "#111827" : "#ffffff",
        borderRadius: "20px",
        padding: "28px",
        position: "relative",
        boxShadow: isDarkMode
          ? `0 10px 30px rgba(0,0,0,0.38)`
          : `0 8px 25px ${statusColor}30`,
        borderTop: `5px solid ${statusColor}`,
        borderLeft: isDarkMode ? "1px solid #1f2937" : "none",
        borderRight: isDarkMode ? "1px solid #1f2937" : "none",
        borderBottom: isDarkMode ? "1px solid #1f2937" : "none",
        color: isDarkMode ? "#e5e7eb" : "#111827",
      }}
    >
      {/* Status Badge */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "700",
          background: `${statusColor}20`,
          color: statusColor,
        }}
      >
        {getStatusLabel(status)}
      </div>

      <h3
        style={{
          fontSize: "16px",
          color: isDarkMode ? "#94a3b8" : "#6b7280",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
        }}
      >
        <p
          style={{
            fontSize: "42px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          {value}
        </p>
        <span style={{ fontSize: "18px", color: isDarkMode ? "#94a3b8" : "#6b7280" }}>
          {unit}
        </span>
      </div>

      {/* Change indicator */}
      {prevValue !== null && (isIncreased || isDecreased) && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: isDecreased ? "#dc2626" : "#059669",
          }}
        >
          {isDecreased ? "↓" : "↑"} {difference} {unit}
        </div>
      )}
    </motion.div>
  );
}

export default DashboardCard;
