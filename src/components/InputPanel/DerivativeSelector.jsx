export default function DerivativeSelector({ order, onChange, disabled }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px", marginTop: "6px" }}>
      <div style={{ color: "#94a3b8", fontSize: "10px", marginBottom: "4px" }}>求导阶数</div>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => onChange(n)} disabled={disabled}
            style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: disabled ? "not-allowed" : "pointer", border: order === n ? "1px solid #86efac" : "1px solid #e2e8f0", background: order === n ? "#dcfce7" : "#f1f5f9", color: order === n ? "#16a34a" : "#64748b", fontWeight: order === n ? 600 : 400 }}>
            {n}阶
          </button>
        ))}
        <input type="number" min={1} max={10} value={order}
          onChange={(e) => onChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          disabled={disabled}
          style={{ width: "38px", padding: "4px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", color: "#1e293b", fontSize: "11px", textAlign: "center" }} />
        <span style={{ color: "#94a3b8", fontSize: "10px" }}>阶</span>
      </div>
    </div>
  );
}
