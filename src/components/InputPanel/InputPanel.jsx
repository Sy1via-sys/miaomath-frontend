import ImageUploader from "./ImageUploader";
import OcrResult from "./OcrResult";
import DerivativeSelector from "./DerivativeSelector";

export default function InputPanel({
  onUpload,
  latex,
  onLatexChange,
  derivativeOrder,
  onOrderChange,
  ocrLoading,
  ocrError,
  analyzeLoading,
  onAnalyze,
}) {
  return (
    <div>
      <div style={{ color: "#58a6ff", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>
        输入
      </div>
      <ImageUploader onUpload={onUpload} disabled={ocrLoading} />
      <OcrResult latex={latex} loading={ocrLoading} error={ocrError} onChange={onLatexChange} />
      <DerivativeSelector order={derivativeOrder} onChange={onOrderChange} disabled={analyzeLoading} />
      <button
        onClick={onAnalyze}
        disabled={!latex.trim() || analyzeLoading}
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "10px",
          borderRadius: "6px",
          border: "none",
          background: latex.trim() && !analyzeLoading
            ? "linear-gradient(135deg, #3fb950, #238636)"
            : "#21262d",
          color: latex.trim() && !analyzeLoading ? "#fff" : "#484f58",
          fontSize: "14px",
          fontWeight: 600,
          cursor: latex.trim() && !analyzeLoading ? "pointer" : "not-allowed",
          transition: "opacity 0.2s",
        }}
      >
        {analyzeLoading ? "分析中..." : "开始分析"}
      </button>
    </div>
  );
}
