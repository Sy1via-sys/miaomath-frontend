export default function MainLayout({ left, center, right }) {
  return (
    <div style={{
      display: "flex",
      gap: "12px",
      padding: "16px",
      height: "calc(100vh - 57px)",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "280px",
        minWidth: "280px",
        background: "#161b22",
        borderRadius: "8px",
        border: "1px solid #30363d",
        padding: "14px",
        overflowY: "auto",
        flexShrink: 0,
      }}>
        {left}
      </div>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: 0,
      }}>
        {center}
      </div>
      <div style={{
        width: "260px",
        minWidth: "260px",
        background: "#161b22",
        borderRadius: "8px",
        border: "1px solid #30363d",
        padding: "14px",
        overflowY: "auto",
        flexShrink: 0,
      }}>
        {right}
      </div>
    </div>
  );
}
