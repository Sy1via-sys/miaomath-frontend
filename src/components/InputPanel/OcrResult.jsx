export default function OcrResult({ latex, loading, error, onChange }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ color: "#8b949e", fontSize: "11px", marginBottom: "4px" }}>
        识别结果（可编辑）
      </div>
      {loading ? (
        <div style={{
          background: "#0d1117",
          borderRadius: "6px",
          padding: "10px",
          textAlign: "center",
          color: "#8b949e",
          fontSize: "13px",
        }}>
          识别中...
        </div>
      ) : error ? (
        <div style={{
          background: "#f8514911",
          borderRadius: "6px",
          padding: "10px",
          color: "#f85149",
          fontSize: "12px",
        }}>
          {error}
        </div>
      ) : (
        <input
          type="text"
          value={latex}
          onChange={(e) => onChange(e.target.value)}
          placeholder="LaTeX 表达式，如 x^2+2x+1"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 10px",
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: "6px",
            color: "#e6edf3",
            fontSize: "13px",
            fontFamily: "monospace",
            outline: "none",
          }}
        />
      )}
    </div>
  );
}
