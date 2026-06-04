import { useState } from "react";

const EXAMPLES = [
  {
    label: "二次函数",
    latex: "f(x) = x^2 - 4x + 3",
    type: "function",
    desc: "中考 · 求顶点与交点",
  },
  {
    label: "圆锥曲线",
    latex: "\\frac{x^2}{4} + \\frac{y^2}{3} = 1",
    type: "analytic_geometry",
    desc: "高考 · 椭圆焦点离心率",
  },
  {
    label: "三次函数",
    latex: "f(x) = x^3 - 3x + 1",
    type: "function",
    desc: "高考 · 求极值与单调性",
  },
];

const STEPS = [
  { key: "upload", label: "上传" },
  { key: "recognize", label: "识别" },
  { key: "analyze", label: "分析" },
  { key: "done", label: "完成" },
];

export default function Header({ currentStep = 0, onExample, onReset, user, isGuest, onLogout, onHistory }) {
  const [showHelp, setShowHelp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="glass-header" style={{
        padding: "8px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 10,
        gap: "16px",
      }}>
        {/* Left: Logo + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{
            width: "36px", height: "36px",
            background: "#fff",
            borderRadius: "10px", display: "flex", alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(30, 41, 59, 0.10)",
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="26" height="26">
              <path d="M6 24 C6 10 14 2 24 4 C34 2 42 10 42 24 C42 34 36 42 28 42 C22 42 20 40 20 38" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20 L6 4 L22 12" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M36 20 L42 4 L26 12" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="17" cy="22" r="2" fill="#1e293b"/>
              <circle cx="31" cy="22" r="2" fill="#1e293b"/>
              <path d="M22 27 L24 29 L26 27" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 32 Q22 37 24 32 Q26 37 30 32 Q34 27 40 28 T46 24" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="28" x2="13" y2="29" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="3" y1="32" x2="13" y2="32" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="28" y1="38" x2="20" y2="37" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="28" y1="40" x2="21" y2="39" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <h1 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>MiaoMath</h1>
          </div>
        </div>

        {/* Center: Step indicator + Examples */}
        <div style={{
          display: "flex", alignItems: "center", gap: "14px",
          flex: 1, justifyContent: "center",
        }}>
          {/* Step indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            padding: "4px 12px",
            background: "rgba(255,255,255,0.5)",
            borderRadius: "20px",
            backdropFilter: "blur(4px)",
          }}>
            {STEPS.map((s, i) => (
              <div key={s.key} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: i <= currentStep ? "22px" : "8px",
                  height: i <= currentStep ? "22px" : "8px",
                  borderRadius: "50%",
                  background: i < currentStep
                    ? "#10b981"
                    : i === currentStep
                      ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                      : "#cbd5e1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "10px", fontWeight: 700,
                  transition: "all 0.35s ease",
                  boxShadow: i === currentStep ? "0 0 12px rgba(59,130,246,0.4)" : "none",
                }}>
                  {i < currentStep ? "✓" : i === currentStep ? i + 1 : ""}
                </div>
                <span style={{
                  marginLeft: "5px",
                  fontSize: "10px",
                  color: i <= currentStep ? "#1e293b" : "#94a3b8",
                  fontWeight: i === currentStep ? 600 : 400,
                  transition: "all 0.35s ease",
                }}>{s.label}</span>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: "20px", height: "1.5px",
                    background: i < currentStep ? "#10b981" : "#e2e8f0",
                    margin: "0 6px",
                    transition: "background 0.35s ease",
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "18px", background: "#e2e8f0" }} />

          {/* Example quick-load buttons */}
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#94a3b8", marginRight: "2px" }}>示例</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => onExample?.(ex)}
                className="glass-btn"
                title={ex.desc}
                style={{ padding: "4px 12px", fontSize: "11px", whiteSpace: "nowrap" }}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", gap: "6px", flexShrink: 0, alignItems: "center" }}>
          <button type="button" onClick={() => onReset?.()} className="glass-btn" style={{ padding: "5px 10px", fontSize: "11px" }}>
            ✨ 新建
          </button>
          <button type="button" onClick={() => setShowHelp(!showHelp)} className="glass-btn" style={{ padding: "5px 10px", fontSize: "11px" }}>
            ❓ 帮助
          </button>

          {/* History button — hidden for guests */}
          {!isGuest && (
            <button type="button" onClick={() => onHistory?.()} className="glass-btn" style={{ padding: "5px 10px", fontSize: "11px" }} title="历史记录">
              📋 记录
            </button>
          )}

          {/* User menu */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #1e293b, #475569)",
                color: "#fff", fontSize: "13px", fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "?"}
            </button>

            {showUserMenu && (
              <div style={{
                position: "absolute", top: "40px", right: 0,
                background: "#fff", borderRadius: 10,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                border: "1px solid #e2e8f0",
                minWidth: "140px", overflow: "hidden", zIndex: 101,
              }}>
                <div style={{ padding: "10px 14px", fontSize: 12, color: "#475569", borderBottom: "1px solid #f1f5f9" }}>
                  {user?.username || "用户"}
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); onLogout?.(); }}
                  style={{
                    width: "100%", padding: "8px 14px", border: "none",
                    background: "transparent", fontSize: 12, color: "#ef4444",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help popover */}
      {showHelp && (
        <div style={{
          position: "fixed", top: "56px", right: "24px",
          zIndex: 100,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          border: "1px solid rgba(226,232,240,0.8)",
          minWidth: "220px",
          fontSize: "12px",
          color: "#475569",
          lineHeight: 1.8,
        }}>
          <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "6px", fontSize: "13px" }}>使用帮助</div>
          <div><b>拍照/粘贴</b> 上传数学题图片</div>
          <div><b>点击示例</b> 快速体验中考/高考题</div>
          <div><b>编辑 LaTeX</b> 调整识别结果</div>
          <div><b>开始分析</b> 生成图像和性质</div>
          <div><b>导出</b> 保存 HTML / GGB 文件</div>
          <button onClick={() => setShowHelp(false)}
            className="glass-btn"
            style={{ marginTop: "8px", padding: "3px 12px", fontSize: "11px", width: "100%" }}>
            知道了
          </button>
        </div>
      )}
    </>
  );
}
