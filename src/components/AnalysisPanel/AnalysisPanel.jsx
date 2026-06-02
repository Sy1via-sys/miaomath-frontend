import PropertyCard from "./PropertyCard";
import DerivativeList from "./DerivativeList";

export default function AnalysisPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div>
        <div style={{ color: "#58a6ff", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>
          函数性质
        </div>
        <div style={{ color: "#8b949e", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
          分析中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={{ color: "#58a6ff", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>
          函数性质
        </div>
        <div style={{
          color: "#f85149",
          fontSize: "12px",
          background: "#f8514911",
          borderRadius: "6px",
          padding: "10px",
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!result || !result.success) {
    return (
      <div>
        <div style={{ color: "#58a6ff", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>
          函数性质
        </div>
        <div style={{ color: "#484f58", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
          {result?.error || "等待分析..."}
        </div>
      </div>
    );
  }

  const properties = [
    { label: "定义域", value: result.domain, color: "#e94560" },
    { label: "零点", value: result.zeros, color: "#3fb950" },
    { label: "极值点", value: result.extrema, color: "#f0883e" },
    { label: "拐点", value: result.inflection_points, color: "#d2a8ff" },
    { label: "单调递增", value: result.monotonic_increasing, color: "#79c0ff" },
    { label: "单调递减", value: result.monotonic_decreasing, color: "#79c0ff" },
  ];

  return (
    <div>
      <div style={{ color: "#58a6ff", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>
        函数性质
      </div>
      <DerivativeList derivatives={result.derivatives} />
      {properties.map((p) => (
        <PropertyCard key={p.label} label={p.label} value={p.value} color={p.color} />
      ))}
    </div>
  );
}
