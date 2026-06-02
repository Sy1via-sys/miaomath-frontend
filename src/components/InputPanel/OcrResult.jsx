export default function OcrResult({ latex, loading, error, onChange }) {
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ color: "#94a3b8", fontSize: "10px", marginBottom: "3px" }}>表达式（可编辑）</div>
      {loading ? (
        <div style={{ background: "#f8fafc", borderRadius: "6px", padding: "8px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>识别中...</div>
      ) : error ? (
        <div style={{ background: "#fef2f2", borderRadius: "6px", padding: "8px", color: "#ef4444", fontSize: "11px" }}>{error}</div>
      ) : (
        <input type="text" value={latex} onChange={(e) => onChange(e.target.value)}
          placeholder="LaTeX 表达式，如 x^2+2x+1"
          style={{ width: "100%", boxSizing: "border-box", padding: "7px 9px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b", fontSize: "12px", fontFamily: "monospace" }} />
      )}
    </div>
  );
}
