export default function DerivativeSelector({ order, onChange, disabled }) {
  const presets = [1, 2, 3];

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ color: "#8b949e", fontSize: "11px", marginBottom: "6px" }}>
        求导阶数
      </div>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {presets.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            disabled={disabled}
            style={{
              padding: "5px 12px",
              borderRadius: "4px",
              border: order === n ? "1px solid #3fb950" : "1px solid #30363d",
              background: order === n ? "#3fb95022" : "#0d1117",
              color: order === n ? "#3fb950" : "#8b949e",
              fontSize: "12px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {n} 阶
          </button>
        ))}
        <input
          type="number"
          min={1}
          max={10}
          value={order}
          onChange={(e) => onChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          disabled={disabled}
          style={{
            width: "50px",
            padding: "5px 6px",
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: "4px",
            color: "#e6edf3",
            fontSize: "12px",
            textAlign: "center",
            outline: "none",
          }}
        />
        <span style={{ color: "#8b949e", fontSize: "11px" }}>阶</span>
      </div>
    </div>
  );
}
