export default function DerivativeList({ derivatives }) {
  if (!derivatives || derivatives.length === 0) return null;
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ color: "#94a3b8", fontSize: "10px", marginBottom: "4px" }}>各阶导数</div>
      {derivatives.map((d) => (
        <div key={d.order} style={{ background: "#f8fafc", borderRadius: "4px", padding: "4px 8px", marginBottom: "3px", fontFamily: "monospace", fontSize: "10px", color: "#f97316" }}>
          f<sup>({d.order})</sup>(x) = {d.expression}
        </div>
      ))}
    </div>
  );
}
