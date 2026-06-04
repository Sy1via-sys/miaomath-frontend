import { useState } from "react";

export default function SettingsModal({ settings, onSave, onClose }) {
  const [model, setModel] = useState(settings.model || "qwen-vl-max");
  const [solutionModel, setSolutionModel] = useState(settings.solutionModel || "deepseek-chat");

  const handleSave = () => {
    onSave({
      model: model.trim() || "qwen-vl-max",
      solutionModel: solutionModel.trim() || "deepseek-chat",
    });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
    }} onClick={onClose}>
      <div className="glass-card-strong" style={{
        padding: "24px", width: "440px",
        maxHeight: "80vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#1e293b" }}>API 设置</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: "18px", cursor: "pointer",
            color: "#94a3b8", padding: "4px 8px", borderRadius: "4px",
          }}>✕</button>
        </div>

        <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>
          API 密钥已内置，无需手动配置。以下选项供高级用户调整模型。
        </p>

        <div style={{ marginBottom: "16px" }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#3b82f6" }}>图片识别模型</h4>

          <div style={{ marginBottom: "10px" }}>
            <label style={labelStyle}>模型名称</label>
            <input value={model} onChange={(e) => setModel(e.target.value)}
              placeholder="qwen-vl-max"
              style={inputStyle} />
            <div style={hintStyle}>需支持视觉（vision）能力</div>
          </div>
        </div>

        <div style={{ marginBottom: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#f59e0b" }}>解题思路模型</h4>

          <div style={{ marginBottom: "10px" }}>
            <label style={labelStyle}>模型名称</label>
            <input value={solutionModel} onChange={(e) => setSolutionModel(e.target.value)}
              placeholder="deepseek-chat"
              style={inputStyle} />
            <div style={hintStyle}>文本模型即可，用于生成解题思路</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0",
            background: "#f8fafc", color: "#64748b", fontSize: "13px", cursor: "pointer",
          }}>取消</button>
          <button onClick={handleSave} style={{
            padding: "8px 16px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}>保存</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "8px 10px",
  background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px",
  color: "#1e293b", fontSize: "13px", outline: "none",
};

const labelStyle = {
  display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px",
};

const hintStyle = {
  fontSize: "10px", color: "#94a3b8", marginTop: "2px",
};
