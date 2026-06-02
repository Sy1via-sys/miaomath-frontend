import { useRef, useState, useCallback } from "react";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ onUpload, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);

  const validateAndUpload = useCallback(
    (file) => {
      setLocalError(null);
      if (!ALLOWED_TYPES.includes(file.type)) {
        setLocalError("仅支持 PNG / JPG / WebP 格式");
        return;
      }
      if (file.size > MAX_SIZE) {
        setLocalError("文件不能超过 10MB，请压缩后重试");
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      onUpload(file);
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndUpload(file);
    },
    [validateAndUpload],
  );

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) validateAndUpload(file);
    },
    [validateAndUpload],
  );

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "#58a6ff" : "#30363d"}`,
          borderRadius: "8px",
          padding: "28px 16px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: dragOver ? "#1f6feb11" : "#0d1117",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: "100%", maxHeight: "160px", borderRadius: "4px" }}
          />
        ) : (
          <>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
            <div style={{ color: "#e6edf3", fontSize: "13px", marginBottom: "4px" }}>
              点击上传或拖拽图片
            </div>
            <div style={{ color: "#8b949e", fontSize: "11px" }}>
              PNG / JPG / WebP，不超过 10MB
            </div>
          </>
        )}
      </div>
      {localError && (
        <div style={{
          color: "#f85149",
          fontSize: "12px",
          marginTop: "8px",
          padding: "6px 10px",
          background: "#f8514911",
          borderRadius: "4px",
        }}>
          {localError}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
