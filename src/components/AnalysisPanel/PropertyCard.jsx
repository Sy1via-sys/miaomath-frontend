export default function PropertyCard({ label, value, color = "#e2e8f0" }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const displayValue = Array.isArray(value)
    ? value.map((v) => (typeof v === "object" ? `${v.point} (${v.type})` : String(v))).join("、")
    : String(value);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", background: "#f8fafc", borderRadius: "6px", borderLeft: `2px solid ${color}`, marginBottom: "3px" }}>
      <span style={{ color: "#64748b", fontSize: "10px" }}>{label}</span>
      <span style={{ color: "#1e293b", fontSize: "10px" }}>{displayValue}</span>
    </div>
  );
}
