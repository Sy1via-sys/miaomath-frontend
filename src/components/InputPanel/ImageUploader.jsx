import { useRef, useState, useCallback } from "react";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ onUpload, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);

  const validateAndUpload = useCallback((file) => {
    setLocalError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError("仅支持 PNG / JPG / WebP 格式");
      return;
    }
    if (file.size > MAX_SIZE) {
      setLocalError("文件不能超过 10MB，请压缩后重试");
      return;
    }
    setPreview(URL.createObjectURL(file));
    onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  }, [validateAndUpload]);

  const handlePaste = useCallback((e) => {
    const file = e.clipboardData?.files?.[0];
    if (file) validateAndUpload(file);
  }, [validateAndUpload]);

  return (
    <div>
      <div
        onClick={() => { if (!disabled) inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        style={{
          background: dragOver ? "#eff6ff" : "#fff",
          border: `2px dashed ${dragOver ? "#3b82f6" : "#cbd5e1"}`,
          borderRadius: "12px", padding: "18px 14px", textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "all 0.2s ease",
          boxShadow: dragOver ? "0 0 0 6px rgba(59,130,246,0.08)" : "none",
        }}
      >
        {preview ? (
          <img src={preview} alt="preview"
            style={{ maxWidth: "100%", maxHeight: "140px", borderRadius: "8px" }} />
        ) : (
          <>
            <div style={{
              width: "40px", height: "40px", margin: "0 auto 6px",
              background: "#eff6ff", borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>📷</div>
            <div style={{ color: "#334155", fontSize: "13px", fontWeight: 600 }}>上传数学题目</div>
            <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "2px" }}>
              拖拽 / 点击 / Ctrl+V 粘贴
            </div>
            <div style={{ color: "#cbd5e1", fontSize: "9px", marginTop: "3px" }}>
              PNG · JPG · WebP · ≤10MB
            </div>
          </>
        )}
      </div>
      {localError && (
        <div style={{
          color: "#ef4444", fontSize: "11px", marginTop: "6px",
          padding: "6px 10px", background: "#fef2f2", borderRadius: "6px",
        }}>{localError}</div>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp"
        onChange={(e) => { if (e.target.files[0]) validateAndUpload(e.target.files[0]); }}
        style={{ display: "none" }} />
    </div>
  );
}
