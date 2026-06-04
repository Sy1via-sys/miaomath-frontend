export default function MainLayout({ left, center, right }) {
  return (
    <div style={{
      display: "flex", gap: "12px", padding: "16px",
      height: "calc(100vh - 61px)", boxSizing: "border-box",
      position: "relative", zIndex: 1,
    }}>
      <div style={{
        width: "270px", minWidth: "270px", flexShrink: 0,
        display: "flex", flexDirection: "column", gap: "8px",
        overflowY: "auto",
      }}>
        {left}
      </div>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: "8px", minWidth: 0,
      }}>
        {center}
      </div>
      <div style={{
        width: "220px", minWidth: "220px", flexShrink: 0,
        display: "flex", flexDirection: "column",
      }}>
        {right}
      </div>
    </div>
  );
}
