import PropertyCard from "./PropertyCard";
import DerivativeList from "./DerivativeList";
import { LatexContent } from "../MathDisplay";

export default function AnalysisPanel({ result, loading, error, solution = [] }) {
  if (loading) {
    return (
      <div className="glass-card-strong" style={panelStyle}>
        <div style={titleStyle}>📊 函数性质</div>
        <div style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center", padding: "20px 0" }}>分析中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card-strong" style={panelStyle}>
        <div style={titleStyle}>📊 函数性质</div>
        <div style={{ color: "#ef4444", fontSize: "11px", background: "rgba(254,242,242,0.7)", borderRadius: "6px", padding: "10px" }}>{error}</div>
      </div>
    );
  }

  if (!result || !result.success) {
    return (
      <div className="glass-card-strong" style={panelStyle}>
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

  const isConic = result.conic_type && result.conic_type !== "unknown";
  const conicLabel = {
    circle: "圆", ellipse: "椭圆", hyperbola: "双曲线",
    parabola: "抛物线", rotated_conic: "旋转圆锥曲线",
  };
  const conicProperties = isConic
    ? [
        { label: "类型", value: conicLabel[result.conic_type] || result.conic_type, color: "#8b5cf6" },
        { label: "标准方程", value: result.standard_form, color: "#8b5cf6" },
        { label: "参数", value: result.parameters ? Object.entries(result.parameters).map(([k, v]) => `${k}=${v}`).join(", ") : null, color: "#8b5cf6" },
        { label: "中心", value: result.center ? `(${result.center.join(", ")})` : null, color: "#8b5cf6" },
        { label: "焦点", value: result.foci?.map((f) => `(${f.join(", ")})`).join("、"), color: "#8b5cf6" },
        { label: "离心率", value: result.eccentricity, color: "#8b5cf6" },
        { label: "渐近线", value: result.asymptotes?.join("；"), color: "#8b5cf6" },
        { label: "准线", value: result.directrix, color: "#8b5cf6" },
      ]
    : [];

  return (
    <div className="glass-card-strong" style={panelStyle}>
      <div style={titleStyle}>📊 函数性质</div>
      <DerivativeList derivatives={result.derivatives} />
      {properties.map((p) => (
        <PropertyCard key={p.label} label={p.label} value={p.value} color={p.color} />
      ))}

      {isConic && (
        <div style={{ marginTop: "12px" }}>
          <div style={{ color: "#8b5cf6", fontWeight: 700, fontSize: "11px", marginBottom: "6px", borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
            📐 圆锥曲线
          </div>
          {conicProperties.map((p) => (
            <PropertyCard key={p.label} label={p.label} value={p.value} color={p.color} />
          ))}
        </div>
      )}

      {solution.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div style={{
            color: "#1e293b", fontWeight: 700, fontSize: "12px",
            marginBottom: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "12px",
          }}>
            💡 解题思路
          </div>
          {solution.map((s) => (
            <div key={s.step} style={{
              marginBottom: "8px", padding: "10px 12px",
              background: "rgba(255,251,235,0.7)", borderRadius: "10px",
              borderLeft: "3px solid #f59e0b",
              backdropFilter: "blur(4px)",
            }}>
              <div style={{
                fontSize: "11px", fontWeight: 700, color: "#92400e",
                marginBottom: "4px",
              }}>
                步骤 {s.step}：{s.title}
              </div>
              <div style={{ fontSize: "12px", color: "#78716c", lineHeight: "1.7" }}>
                <LatexContent text={s.content} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const panelStyle = {
  padding: "14px",
  overflowY: "auto",
  height: "100%",
};

const titleStyle = {
  color: "#1e293b", fontWeight: 700, fontSize: "12px", marginBottom: "8px",
};
