import GraphCanvas from "./GraphCanvas";

export default function GraphPanel({ commands, isGeometry }) {
  if (!commands || commands.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#94a3b8", fontSize: "13px", background: "#fff",
        borderRadius: "10px", border: "1px solid #e2e8f0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}>
        上传图片并点击"开始分析"以查看图像
      </div>
    );
  }

  // Geometry mode: single large canvas
  if (isGeometry) {
    return (
      <div style={{
        flex: 1, background: "#fff", borderRadius: "10px",
        border: "1px solid #e2e8f0", padding: "10px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column",
      }}>
        <div style={{ marginBottom: "6px" }}>
          <span style={{
            background: "#ffedd5", color: "#c2410c",
            padding: "2px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: 700,
          }}>📏 几何图形</span>
        </div>
        <GraphCanvas index={0} command={commands[0]} />
      </div>
    );
  }

  // Function mode: stacked canvases
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      gap: "6px", overflowY: "auto",
    }}>
      {commands.map((cmd, i) => (
        <GraphCanvas key={i} index={i} command={cmd} />
      ))}
    </div>
  );
}
