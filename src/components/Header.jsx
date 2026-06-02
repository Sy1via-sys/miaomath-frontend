export default function Header({ onOpenSettings }) {
  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px", height: "36px",
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          borderRadius: "10px", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#fff", fontSize: "17px", fontWeight: 700,
        }}>∑</div>
        <div>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
            Math Graph Solver
          </h1>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>拍照 → 识别 → 分析 → 导出</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onOpenSettings} style={headerBtnStyle}>🔑 API 设置</button>
        <button style={headerBtnStyle}>❓ 帮助</button>
      </div>
    </header>
  );
}

const headerBtnStyle = {
  padding: "5px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer",
  border: "1px solid #e2e8f0", background: "#f1f5f9", color: "#64748b",
};
