export default function Header() {
  return (
    <header style={{
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      borderBottom: "1px solid #30363d",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "22px" }}>📐</span>
        <h1 style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 700,
          color: "#e6edf3",
          letterSpacing: "0.5px",
        }}>
          Math Graph Solver
        </h1>
      </div>
      <span style={{
        fontSize: "12px",
        color: "#8b949e",
      }}>
        拍照上传 → 识别公式 → 函数分析
      </span>
    </header>
  );
}
