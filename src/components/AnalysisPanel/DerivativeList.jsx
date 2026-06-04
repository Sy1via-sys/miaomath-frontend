import MathDisplay from "../MathDisplay";

export default function DerivativeList({ derivatives }) {
  if (!derivatives || derivatives.length === 0) return null;
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ color: "#94a3b8", fontSize: "10px", marginBottom: "4px" }}>各阶导数</div>
      {derivatives.map((d) => {
        const latex = `f^{(${d.order})}(x) = ${d.expression}`;
        return (
          <div key={d.order} style={{ background: "rgba(248,250,252,0.6)", borderRadius: "8px", padding: "6px 10px", marginBottom: "4px", fontSize: "12px", color: "#f97316" }}>
            <MathDisplay latex={latex} />
          </div>
        );
      })}
    </div>
  );
}
