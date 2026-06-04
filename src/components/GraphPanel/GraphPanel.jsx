import GraphCanvas from "./GraphCanvas";

export default function GraphPanel({ commands, isGeometry, problemType }) {
  if (!commands || commands.length === 0) {
    return (
      <div className="glass-card-strong" style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#94a3b8", fontSize: "13px",
      }}>
        上传图片并点击"开始分析"以查看图像
      </div>
    );
  }

  const isSolid = problemType === "solid_geometry";
  const isGeometryMode = isGeometry;
  const badgeStyle = isSolid
    ? { background: "#f3e8ff", color: "#7c3aed" }
    : isGeometryMode
      ? { background: "#ffedd5", color: "#c2410c" }
      : { background: "#dbeafe", color: "#1d4ed8" };
  const badgeText = isSolid ? "📦 立体图形" : isGeometryMode ? "📏 几何图形" : "📈 函数图像";

  return (
    <div className="glass-card-strong" style={{
      flex: 1, padding: "10px", display: "flex", flexDirection: "column",
    }}>
      <div style={{ marginBottom: "6px" }}>
        <span style={{
          background: badgeStyle.background,
          color: badgeStyle.color,
          padding: "2px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: 700,
        }}>
          {badgeText}
        </span>
      </div>
      <GraphCanvas commands={commands} />
      <div style={{ marginTop: "4px", fontSize: "9px", color: "#94a3b8", maxHeight: "60px", overflowY: "auto" }}>
        {commands.join(" | ")}
      </div>
    </div>
  );
}
