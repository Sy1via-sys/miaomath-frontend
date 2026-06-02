export default function MainLayout({ left, center, right }) {
  return (
    <div style={{
      display: "flex", gap: "12px", padding: "16px",
      height: "calc(100vh - 57px)", boxSizing: "border-box",
    }}>
      <div style={{
        width: "270px", minWidth: "270px", flexShrink: 0,
        display: "flex", flexDirection: "column", gap: "6px",
      }}>
        {left}
      </div>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: "6px", minWidth: 0, overflowY: "auto",
      }}>
        {center}
      </div>
      <div style={{
        width: "210px", minWidth: "210px", flexShrink: 0,
        overflowY: "auto",
      }}>
        {right}
      </div>
    </div>
  );
}
