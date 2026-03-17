import { motion } from "framer-motion";

function DashboardCard({ title, value, unit, variant = "blue", prevValue = null }) {
  const colorSchemes = {
    blue: {
      background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)",
      accentColor: "#1e40af",
      textColor: "#1e3a8a",
    },
    purple: {
      background: "linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%)",
      boxShadow: "0 10px 30px rgba(168, 85, 247, 0.2)",
      accentColor: "#6d28d9",
      textColor: "#581c87",
    },
    pink: {
      background: "linear-gradient(135deg, #fbcfe8 0%, #f5d4e6 100%)",
      boxShadow: "0 10px 30px rgba(236, 72, 153, 0.2)",
      accentColor: "#be185d",
      textColor: "#831843",
    },
    green: {
      background: "linear-gradient(135deg, #d1fae5 0%, #c6f6d5 100%)",
      boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)",
      accentColor: "#047857",
      textColor: "#065f46",
    },
    orange: {
      background: "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)",
      boxShadow: "0 10px 30px rgba(249, 115, 22, 0.2)",
      accentColor: "#b45309",
      textColor: "#7c2d12",
    },
    red: {
      background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
      boxShadow: "0 10px 30px rgba(239, 68, 68, 0.2)",
      accentColor: "#991b1b",
      textColor: "#7f1d1d",
    },
  };

  const scheme = colorSchemes[variant] || colorSchemes.blue;

  // Determine if value increased or decreased
  const isIncreased = prevValue !== null && value > prevValue;
  const isDecreased = prevValue !== null && value < prevValue;
  const difference = prevValue !== null ? Math.abs(value - prevValue).toFixed(2) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      style={{
        background: scheme.background,
        boxShadow: scheme.boxShadow,
        borderRadius: "24px",
        padding: "32px",
        textAlign: "center",
        color: scheme.textColor,
        border: "2px solid rgba(255, 255, 255, 0.6)",
        transition: "all 300ms ease",
      }}
    >
      <h3 style={{
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "12px",
        opacity: 0.85,
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: scheme.textColor,
      }}>
        {title}
      </h3>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: "8px",
      }}>
        <p style={{
          fontSize: "48px",
          fontWeight: "700",
          margin: 0,
          color: scheme.accentColor,
        }}>{value}</p>
        <p style={{
          fontSize: "20px",
          opacity: 0.7,
          margin: 0,
          color: scheme.textColor,
        }}>{unit}</p>
      </div>

      {/* Comparison Indicator */}
      {prevValue !== null && (isIncreased || isDecreased) && (
        <div style={{
          marginTop: "12px",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          color: isDecreased ? "#dc2626" : "#059669",
          backgroundColor: isDecreased ? "rgba(220, 38, 38, 0.1)" : "rgba(5, 150, 105, 0.1)",
          padding: "8px 12px",
          borderRadius: "12px",
        }}>
          <span style={{ fontSize: "18px" }}>{isDecreased ? "↓" : "↑"}</span>
          <span>{difference} {unit}</span>
        </div>
      )}
    </motion.div>
  );
}

export default DashboardCard;