function StatusCard({ title, value, threshold, type }) {
  if (value === undefined || value === null) {
    return null;
  }

  let status = "normal";

  if (type === "max" && value > threshold) {
    status = "warning";
  }

  if (type === "min" && value < threshold) {
    status = "critical";
  }

  const colors = {
    normal: "#22c55e",
    warning: "#f59e0b",
    critical: "#ef4444",
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
        borderTop: `5px solid ${colors[status]}`,
      }}
    >
      <h4 style={{ margin: 0, color: "#6b7280" }}>{title}</h4>
      <h2 style={{ margin: "10px 0" }}>{value}</h2>
      <span
        style={{
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          background: colors[status] + "20",
          color: colors[status],
        }}
      >
        {status.toUpperCase()}
      </span>
    </div>
  );
}

export default StatusCard;