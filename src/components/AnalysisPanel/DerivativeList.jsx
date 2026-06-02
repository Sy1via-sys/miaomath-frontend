export default function DerivativeList({ derivatives }) {
  if (!derivatives || derivatives.length === 0) return null;

  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ color: "#8b949e", fontSize: "11px", marginBottom: "6px" }}>各阶导数</div>
      {derivatives.map((d) => (
        <div key={d.order} style={{
          background: "#0d1117",
          borderRadius: "4px",
          padding: "6px 10px",
          marginBottom: "4px",
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#f0883e",
        }}>
          f<sup>({d.order})</sup>(x) = {d.expression}
        </div>
      ))}
    </div>
  );
}
