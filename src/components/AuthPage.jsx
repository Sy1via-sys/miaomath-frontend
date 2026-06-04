import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import MathAnimation from "./MathAnimation";

export default function AuthPage() {
  const { doLogin, doRegister, doGuestLogin } = useAuth();
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (username.length < 3) return "用户名至少 3 个字符";
    if (password.length < 6) return "密码至少 6 个字符";
    if (tab === "register" && password !== confirm) return "两次密码不一致";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    const fn = tab === "login" ? doLogin : doRegister;
    const result = await fn(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "操作失败，请重试");
    }
  };

  const handleGuest = async () => {
    setError("");
    setLoading(true);
    const result = await doGuestLogin();
    setLoading(false);
    if (!result.success) {
      setError(result.error || "游客登录失败");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #eff6ff 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <MathAnimation />

      <div style={{
        width: 400, padding: "36px 32px", borderRadius: 16, position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <svg width="48" height="48" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 56 C18 40 30 20 42 16 C54 12 64 24 58 38 C54 46 44 48 40 40"
              stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <circle cx="24" cy="56" r="2.5" fill="#1e293b"/>
            <circle cx="40" cy="40" r="2.5" fill="#1e293b"/>
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: "8px 0 0" }}>
            MiaoMath
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: 24, borderBottom: "2px solid #e2e8f0" }}>
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              style={{
                flex: 1, padding: "10px 0", border: "none", background: "none",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                color: tab === t ? "#1e293b" : "#94a3b8",
                borderBottom: tab === t ? "2px solid #1e293b" : "2px solid transparent",
                marginBottom: -2, transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {t === "login" ? "登录" : "注册"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text" placeholder="用户名" value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <input
              type="password" placeholder="密码" value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          {tab === "register" && (
            <div style={{ marginBottom: 14 }}>
              <input
                type="password" placeholder="确认密码" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {error && (
            <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 12, textAlign: "center" }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              color: "#fff", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 2px 8px rgba(30,41,59,0.25)",
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => !loading && (e.target.style.transform = "")}
          >
            {loading ? "处理中..." : tab === "login" ? "登 录" : "注 册"}
          </button>
        </form>

        {/* Guest login divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>或</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <button
          type="button" disabled={loading}
          onClick={handleGuest}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 10, border: "1px solid #e2e8f0",
            background: "rgba(255,255,255,0.6)", color: "#64748b", fontSize: 14, fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => !loading && (e.target.style.background = "rgba(241,245,249,0.8)")}
          onMouseLeave={(e) => !loading && (e.target.style.background = "rgba(255,255,255,0.6)")}
        >
          游客登录（无历史记录）
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#94a3b8" }}>
          数学题目智能分析与解题助手
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
  fontSize: 14, outline: "none", boxSizing: "border-box",
  background: "rgba(248,250,252,0.8)", transition: "border-color 0.2s, box-shadow 0.2s",
};
