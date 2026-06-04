export default function DerivativeSelector({ order, onChange, disabled }) {
  return (
    <div className="glass-card" style={{ padding: "10px", marginTop: "6px" }}>
      <div style={{ color: "#94a3b8", fontSize: "10px", marginBottom: "4px" }}>求导阶数</div>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => onChange(n)} disabled={disabled}
            className={order === n ? "glass-btn-primary" : "glass-btn"}
            style={{ padding: "4px 10px", fontSize: "11px", fontWeight: order === n ? 600 : 400 }}>
            {n}阶
          </button>
        ))}
        <input type="number" min={1} max={10} value={order}
          onChange={(e) => onChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          disabled={disabled}
          className="glass-input"
          style={{ width: "38px", padding: "4px", color: "#1e293b", fontSize: "11px", textAlign: "center" }} />
        <span style={{ color: "#94a3b8", fontSize: "10px" }}>阶</span>
      </div>
    </div>
  );
}
