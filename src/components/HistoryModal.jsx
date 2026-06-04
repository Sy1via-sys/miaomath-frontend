import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import MathDisplay from "./MathDisplay";
import API_BASE from "../api/config";
const TYPE_LABELS = {
  function: "函数", plane_geometry: "平面几何",
  solid_geometry: "立体几何", analytic_geometry: "解析几何",
};
const TYPE_COLORS = {
  function: "#3b82f6", plane_geometry: "#f59e0b",
  solid_geometry: "#8b5cf6", analytic_geometry: "#10b981",
};

export default function HistoryModal({ onClose, onRecall }) {
  const { getToken } = useAuth();
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  const fetchList = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setRecords(data.records);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const handleSelect = async (id) => {
    setSelected(id);
    const res = await fetch(`${API_BASE}/history/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setDetail(data.record);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/history/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRecords((prev) => prev.filter((r) => r.id !== id));
    if (selected === id) { setSelected(null); setDetail(null); }
  };

  const handleRecall = () => {
    if (detail && onRecall) onRecall(detail);
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>历史记录</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 16, height: 420 }}>
          {/* Left list */}
          <div style={{ width: 260, overflowY: "auto", flexShrink: 0 }}>
            {loading && <p style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>加载中...</p>}
            {!loading && records.length === 0 && (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>暂无记录</p>
            )}
            {records.map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelect(r.id)}
                style={{
                  padding: "10px 12px", borderRadius: 8, marginBottom: 6, cursor: "pointer",
                  background: selected === r.id ? "#f1f5f9" : "transparent",
                  border: selected === r.id ? "1px solid #cbd5e1" : "1px solid transparent",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 4,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.title || "无标题"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontSize: 11, padding: "1px 6px", borderRadius: 4,
                    background: (TYPE_COLORS[r.problem_type] || "#94a3b8") + "18",
                    color: TYPE_COLORS[r.problem_type] || "#94a3b8",
                  }}>
                    {TYPE_LABELS[r.problem_type] || r.problem_type || "未知"}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    {r.created_at ? new Date(r.created_at).toLocaleDateString("zh-CN") : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right detail */}
          <div style={{ flex: 1, overflowY: "auto", borderLeft: "1px solid #e2e8f0", paddingLeft: 16 }}>
            {!detail && (
              <p style={{ color: "#94a3b8", textAlign: "center", paddingTop: 60 }}>选择一条记录查看详情</p>
            )}
            {detail && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                  {detail.title}
                </h3>

                {detail.latex && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>表达式</div>
                    <div style={{ fontSize: 14, padding: "8px 12px", background: "#f8fafc", borderRadius: 6 }}>
                      <MathDisplay latex={detail.latex} />
                    </div>
                  </div>
                )}

                {detail.analysis_result?.success && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>分析结果</div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                      {detail.analysis_result.extrema?.length > 0 && (
                        <div>极值点: {detail.analysis_result.extrema.map((e) => `${e.point}(${e.type})`).join(", ")}</div>
                      )}
                      {detail.analysis_result.zeros?.length > 0 && (
                        <div>零点: {detail.analysis_result.zeros.join(", ")}</div>
                      )}
                      {detail.analysis_result.conic_type && detail.analysis_result.conic_type !== "unknown" && (
                        <div>曲线类型: {detail.analysis_result.conic_type}</div>
                      )}
                    </div>
                  </div>
                )}

                {detail.solution_steps?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                      解题步骤 ({detail.solution_steps.length} 步)
                    </div>
                    {detail.solution_steps.slice(0, 3).map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#475569", marginBottom: 4, paddingLeft: 8, borderLeft: "2px solid #e2e8f0" }}>
                        <strong>步骤{s.step}:</strong> {s.title}
                      </div>
                    ))}
                    {detail.solution_steps.length > 3 && (
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>...还有 {detail.solution_steps.length - 3} 步</div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button onClick={handleRecall} style={{
                    padding: "8px 18px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>
                    回看此题
                  </button>
                  <button onClick={() => handleDelete(detail.id)} style={{
                    padding: "8px 18px", borderRadius: 8, border: "1px solid #e2e8f0",
                    background: "#fff", color: "#ef4444", fontSize: 13, cursor: "pointer",
                  }}>
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const modalStyle = {
  width: 680, maxHeight: "80vh", background: "#fff", borderRadius: 16,
  padding: "24px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
};

const closeBtnStyle = {
  width: 32, height: 32, borderRadius: 8, border: "none",
  background: "transparent", fontSize: 16, color: "#94a3b8",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
};
