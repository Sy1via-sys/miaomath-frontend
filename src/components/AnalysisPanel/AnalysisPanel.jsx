import PropertyCard from "./PropertyCard";
import DerivativeList from "./DerivativeList";

export default function AnalysisPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div style={panelStyle}>
        <div style={titleStyle}>📊 函数性质</div>
        <div style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center", padding: "20px 0" }}>分析中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={panelStyle}>
        <div style={titleStyle}>📊 函数性质</div>
        <div style={{ color: "#ef4444", fontSize: "11px", background: "#fef2f2", borderRadius: "6px", padding: "10px" }}>{error}</div>
      </div>
    );
  }

  if (!result || !result.success) {
    return (
      <div style={panelStyle}>
        <div style={titleStyle}>📊 函数性质</div>
        <div style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center", padding: "20px 0" }}>
          {result?.error || "等待分析..."}
        </div>
      </div>
    );
  }

  const properties = [
    { label: "定义域", value: result.domain, color: "#ef4444" },
    { label: "零点", value: result.zeros, color: "#10b981" },
    { label: "极值点", value: result.extrema, color: "#f59e0b" },
    { label: "拐点", value: result.inflection_points, color: "#7c3aed" },
    { label: "单调递增", value: result.monotonic_increasing, color: "#3b82f6" },
    { label: "单调递减", value: result.monotonic_decreasing, color: "#3b82f6" },
  ];

  return (
    <div style={panelStyle}>
      <div style={titleStyle}>📊 函数性质</div>
      <DerivativeList derivatives={result.derivatives} />
      {properties.map((p) => (
        <PropertyCard key={p.label} label={p.label} value={p.value} color={p.color} />
      ))}
    </div>
  );
}

const panelStyle = {
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px",
  padding: "14px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

const titleStyle = {
  color: "#1e293b", fontWeight: 700, fontSize: "12px", marginBottom: "8px",
};
