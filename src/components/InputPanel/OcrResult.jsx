import MathDisplay from "../MathDisplay";

export default function OcrResult({ latex, loading, error, onChange }) {
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ color: "#94a3b8", fontSize: "10px", marginBottom: "3px" }}>题目内容（可编辑）</div>
      {loading ? (
        <div style={{ background: "#f8fafc", borderRadius: "6px", padding: "8px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>识别中...</div>
      ) : error ? (
        <div style={{ background: "#fef2f2", borderRadius: "6px", padding: "8px", color: "#ef4444", fontSize: "11px" }}>{error}</div>
      ) : (
        <>
          <textarea value={latex} onChange={(e) => onChange(e.target.value)}
            placeholder="函数表达式或题目描述，如 f(x)=x^2+2x+1"
            rows={3}
            className="glass-input"
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", color: "#1e293b", fontSize: "12px", fontFamily: "monospace", resize: "vertical", lineHeight: "1.5" }} />
          {latex.trim() && (
            <div className="glass-card" style={{
              padding: "10px 12px", marginTop: "6px", minHeight: "28px",
              fontSize: "16px", color: "#1e293b", overflowX: "auto",
              textAlign: "center",
            }}>
              <MathDisplay latex={latex} displayMode={true} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
