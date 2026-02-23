import { motion } from "framer-motion";

function DashboardCard({ title, value, unit, variant = "blue", prevValue = null }) {
  const colorSchemes = {
    blue: {
      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      boxShadow: "0 20px 50px rgba(59, 130, 246, 0.4)",
    },
    purple: {
      background: "linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)",
      boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)",
    },
    pink: {
      background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
      boxShadow: "0 20px 50px rgba(236, 72, 153, 0.4)",
    },
    green: {
      background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      boxShadow: "0 20px 50px rgba(16, 185, 129, 0.4)",
    },
    orange: {
      background: "linear-gradient(135deg, #f97316 0%, #d97706 100%)",
      boxShadow: "0 20px 50px rgba(249, 115, 22, 0.4)",
    },
    red: {
      background: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",
      boxShadow: "0 20px 50px rgba(239, 68, 68, 0.4)",
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
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "all 300ms ease",
      }}
    >
      <h3 style={{
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "12px",
        opacity: 0.9,
        textTransform: "uppercase",
        letterSpacing: "1px",
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
        }}>{value}</p>
        <p style={{
          fontSize: "20px",
          opacity: 0.8,
          margin: 0,
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
          gap: "4px",
          color: isDecreased ? "#ef4444" : "#10b981",
        }}>
          <span>{isDecreased ? "↓" : "↑"}</span>
          <span>{difference} {unit}</span>
        </div>
      )}
    </motion.div>
  );
}

export default DashboardCard;