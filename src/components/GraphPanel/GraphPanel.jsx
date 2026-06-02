import GraphCanvas from "./GraphCanvas";

export default function GraphPanel({ commands }) {
  if (!commands || commands.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#484f58",
        fontSize: "14px",
        background: "#161b22",
        borderRadius: "8px",
        border: "1px solid #30363d",
      }}>
        上传图片并点击"开始分析"以查看图像
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      overflowY: "auto",
    }}>
      {commands.map((cmd, i) => (
        <GraphCanvas key={i} index={i} command={cmd} />
      ))}
    </div>
  );
}
