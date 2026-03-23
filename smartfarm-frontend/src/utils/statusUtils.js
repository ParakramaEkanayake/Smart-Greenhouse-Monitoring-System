export function checkSensorStatus(value, thresholds) {
  // ✅ Safety check
  if (!thresholds || thresholds.min === undefined || thresholds.max === undefined) {
    return "normal";
  }

  if (value === "--" || value === null || value === undefined || isNaN(value)) {
    return "normal";
  }

  if (value < thresholds.min) return "critical";
  if (value > thresholds.max) return "warning";

  return "normal";
}

export function getStatusColor(status) {
  switch (status) {
    case "critical":
      return "#ef4444";
    case "warning":
      return "#f59e0b";
    case "normal":
      return "#22c55e";
    default:
      return "#9ca3af";
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case "critical":
      return "CRITICAL";
    case "warning":
      return "WARNING";
    case "normal":
      return "NORMAL";
    default:
      return "UNKNOWN";
  }
}

