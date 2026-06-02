export default function PropertyCard({ label, value, color = "#30363d" }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  const displayValue = Array.isArray(value)
    ? value.map((v) => (typeof v === "object" ? `${v.point} (${v.type})` : String(v))).join("、")
    : String(value);

  return (
    <div style={{
      background: "#0d1117",
      borderRadius: "6px",
      padding: "8px 10px",
      borderLeft: `3px solid ${color}`,
      marginBottom: "6px",
    }}>
      <div style={{ color: "#8b949e", fontSize: "10px", marginBottom: "2px" }}>{label}</div>
      <div style={{ color: "#e6edf3", fontSize: "12px", wordBreak: "break-all" }}>{displayValue}</div>
    </div>
  );
}
