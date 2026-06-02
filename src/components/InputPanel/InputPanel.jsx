import ImageUploader from "./ImageUploader";
import OcrResult from "./OcrResult";
import DerivativeSelector from "./DerivativeSelector";

const TYPE_LABELS = {
  "function": "函数",
  "plane_geometry": "平面几何",
  "solid_geometry": "立体几何",
  "analytic_geometry": "解析几何",
};

const TYPE_COLORS = {
  "function": { bg: "#dbeafe", color: "#1d4ed8" },
  "plane_geometry": { bg: "#ffedd5", color: "#c2410c" },
  "solid_geometry": { bg: "#f3e8ff", color: "#7c3aed" },
  "analytic_geometry": { bg: "#dcfce7", color: "#16a34a" },
};

export default function InputPanel({
  onUpload, latex, onLatexChange, derivativeOrder, onOrderChange,
  ocrLoading, ocrError, analyzeLoading, onAnalyze,
  problemType, expressions,
  onExport, isGeometry,
}) {
  const typeInfo = TYPE_COLORS[problemType] || { bg: "#f1f5f9", color: "#64748b" };
  const typeLabel = TYPE_LABELS[problemType] || "未知";
  const showDerivative = !isGeometry;

  return (
    <>
      <ImageUploader onUpload={onUpload} disabled={ocrLoading} />

      {ocrLoading && (
        <div style={cardStyle}>
          <div style={{ color: "#94a3b8", fontSize: "11px", textAlign: "center" }}>AI 识别中...</div>
        </div>
      )}

      {problemType && (
        <div style={cardStyle}>
          <div style={{ color: "#94a3b8", fontSize: "10px", marginBottom: "4px" }}>AI 识别题型</div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <span style={{
              background: typeInfo.bg, color: typeInfo.color,
              padding: "2px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: 600,
            }}>{typeLabel}</span>
            {expressions?.map((e, i) => (
              <span key={i} style={{
                background: "#f1f5f9", color: "#64748b",
                padding: "2px 8px", borderRadius: "12px", fontSize: "10px",
              }}>{e}</span>
            ))}
          </div>
        </div>
      )}

      <OcrResult latex={latex} loading={false} error={ocrError} onChange={onLatexChange} />

      {showDerivative && (
        <DerivativeSelector order={derivativeOrder} onChange={onOrderChange} disabled={analyzeLoading} />
      )}

      <button onClick={onAnalyze} disabled={!latex.trim() || analyzeLoading}
        className="btn-analyze"
        style={{
          width: "100%", marginTop: "8px", padding: "10px", border: "none",
          borderRadius: "8px", background: latex.trim() && !analyzeLoading
            ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#e2e8f0",
          color: latex.trim() && !analyzeLoading ? "#fff" : "#94a3b8",
          fontSize: "13px", fontWeight: 700, cursor: latex.trim() && !analyzeLoading ? "pointer" : "not-allowed",
          boxShadow: latex.trim() && !analyzeLoading ? "0 2px 6px rgba(59,130,246,0.25)" : "none",
          transition: "all 0.2s ease",
        }}
      >{analyzeLoading ? "分析中..." : "开始分析"}</button>

      {/* Export buttons */}
      <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
        {[
          ["📄", "HTML", "html"],
          ["📐", "GGB", "ggb"],
          ["🖼", "PNG", "png"],
          ["🔗", "链接", "link"],
        ].map(([icon, label, format]) => (
          <button key={format} onClick={() => onExport(format)}
            style={{
              flex: 1, padding: "5px 3px", background: "#f8fafc",
              border: "1px solid #e2e8f0", borderRadius: "6px",
              fontSize: "10px", color: "#64748b", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "2px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#eff6ff";
              e.target.style.borderColor = "#3b82f6";
              e.target.style.color = "#2563eb";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f8fafc";
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.color = "#64748b";
              e.target.style.transform = "translateY(0)";
            }}
          >{icon} {label}</button>
        ))}
      </div>
    </>
  );
}

const cardStyle = {
  background: "#fff", border: "1px solid #e2e8f0",
  borderRadius: "10px", padding: "10px", marginTop: "6px",
};
