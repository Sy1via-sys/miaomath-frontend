import { useMemo } from "react";
import { renderLatexContent } from "../MathDisplay";

export default function PropertyCard({ label, value, color = "#e2e8f0" }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  const displayValue = Array.isArray(value)
    ? value.map((v) => (typeof v === "object" ? `${v.point} (${v.type})` : String(v))).join("、")
    : String(value);

  const rendered = useMemo(() => renderLatexContent(displayValue), [displayValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(248,250,252,0.6)", borderRadius: "8px", borderLeft: `3px solid ${color}`, marginBottom: "4px" }}>
      <span style={{ color: "#64748b", fontSize: "10px", fontWeight: 500 }}>{label}</span>
      <span style={{ color: "#1e293b", fontSize: "10px" }} dangerouslySetInnerHTML={{ __html: rendered }} />
    </div>
  );
}
