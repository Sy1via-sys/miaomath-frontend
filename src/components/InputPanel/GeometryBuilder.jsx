import { useState } from "react";

function buildElement(type, params) {
  return { type, params };
}

export default function GeometryBuilder({ elements = [], onChange, onApply }) {
  const [collapsed, setCollapsed] = useState(false);

  const points = elements.filter((e) => e.type === "point");
  const segments = elements.filter((e) => e.type === "segment");
  const sliders = elements.filter((e) => e.type === "slider");
  const totalCount = elements.length;

  function updateByType(type, newItems) {
    const rest = elements.filter((e) => e.type !== type);
    onChange([...rest, ...newItems]);
  }

  function addPoint() {
    updateByType("point", [
      ...points,
      buildElement("point", { name: "", coordinates: ["0", "0"] }),
    ]);
  }

  function updatePoint(index, field, value) {
    const updated = points.map((p, i) => {
      if (i !== index) return p;
      const params = { ...p.params };
      if (field === "name") {
        params.name = value;
      } else if (field === "x") {
        params.coordinates = [value, params.coordinates[1]];
      } else if (field === "y") {
        params.coordinates = [params.coordinates[0], value];
      }
      return { ...p, params };
    });
    updateByType("point", updated);
  }

  function removePoint(index) {
    const name = points[index]?.params?.name;
    const updatedPoints = points.filter((_, i) => i !== index);
    const updatedSegments = segments.filter(
      (s) => s.params.from !== name && s.params.to !== name
    );
    const rest = elements.filter((e) => e.type !== "point" && e.type !== "segment");
    onChange([...rest, ...updatedPoints, ...updatedSegments]);
  }

  const pointNames = points.map((p) => p.params.name).filter(Boolean);

  function addSegment() {
    updateByType("segment", [
      ...segments,
      buildElement("segment", { from: pointNames[0] || "", to: pointNames[0] || "" }),
    ]);
  }

  function updateSegment(index, field, value) {
    const updated = segments.map((s, i) => {
      if (i !== index) return s;
      return { ...s, params: { ...s.params, [field]: value } };
    });
    updateByType("segment", updated);
  }

  function removeSegment(index) {
    updateByType("segment", segments.filter((_, i) => i !== index));
  }

  function addSlider() {
    updateByType("slider", [
      ...sliders,
      buildElement("slider", { name: "", min: -5, max: 5, step: 0.1 }),
    ]);
  }

  function updateSlider(index, field, value) {
    const updated = sliders.map((s, i) => {
      if (i !== index) return s;
      const num = field !== "name" ? (parseFloat(value) ?? 0) : value;
      return { ...s, params: { ...s.params, [field]: num } };
    });
    updateByType("slider", updated);
  }

  function removeSlider(index) {
    updateByType("slider", sliders.filter((_, i) => i !== index));
  }

  return (
    <div className="glass-card" style={{ padding: "10px", marginTop: "6px" }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer", userSelect: "none",
        }}
      >
        <span style={{ color: "#1e293b", fontWeight: 700, fontSize: "11px" }}>
          📐 手动几何构造 {totalCount > 0 && <span style={{ color: "#8b5cf6", fontSize: "10px" }}>({totalCount}项)</span>}
        </span>
        <span style={{ color: "#94a3b8", fontSize: "10px" }}>
          {collapsed ? "▶" : "▼"}
        </span>
      </div>

      {!collapsed && (
        <div style={{ marginTop: "8px" }}>
          {/* Points */}
          <Section title="点" count={points.length} onAdd={addPoint}>
            {points.map((p, i) => (
              <div key={i} style={rowStyle}>
                <input
                  style={inputSm}
                  placeholder="名称"
                  value={p.params.name}
                  onChange={(e) => updatePoint(i, "name", e.target.value)}
                />
                <span style={coordLabel}>x:</span>
                <input
                  style={{ ...inputSm, width: "52px" }}
                  placeholder="x"
                  value={p.params.coordinates[0]}
                  onChange={(e) => updatePoint(i, "x", e.target.value)}
                />
                <span style={coordLabel}>y:</span>
                <input
                  style={{ ...inputSm, width: "52px" }}
                  placeholder="y"
                  value={p.params.coordinates[1]}
                  onChange={(e) => updatePoint(i, "y", e.target.value)}
                />
                <button onClick={() => removePoint(i)} style={delBtn}>×</button>
              </div>
            ))}
          </Section>

          {/* Segments */}
          <Section title="线段" count={segments.length} onAdd={addSegment} disabled={pointNames.length < 2}>
            {segments.map((s, i) => (
              <div key={i} style={rowStyle}>
                <select
                  style={inputSm}
                  value={s.params.from}
                  onChange={(e) => updateSegment(i, "from", e.target.value)}
                >
                  {pointNames.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span style={{ color: "#8b5cf6", fontSize: "12px", fontWeight: 700 }}>→</span>
                <select
                  style={inputSm}
                  value={s.params.to}
                  onChange={(e) => updateSegment(i, "to", e.target.value)}
                >
                  {pointNames.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button onClick={() => removeSegment(i)} style={delBtn}>×</button>
              </div>
            ))}
          </Section>

          {/* Sliders */}
          <Section title="滑块" count={sliders.length} onAdd={addSlider}>
            {sliders.map((s, i) => (
              <div key={i} style={rowStyle}>
                <input
                  style={{ ...inputSm, width: "36px" }}
                  placeholder="名"
                  value={s.params.name}
                  onChange={(e) => updateSlider(i, "name", e.target.value)}
                />
                <span style={coordLabel}>min</span>
                <input
                  style={{ ...inputSm, width: "42px" }}
                  type="number"
                  value={s.params.min}
                  onChange={(e) => updateSlider(i, "min", e.target.value)}
                />
                <span style={coordLabel}>max</span>
                <input
                  style={{ ...inputSm, width: "42px" }}
                  type="number"
                  value={s.params.max}
                  onChange={(e) => updateSlider(i, "max", e.target.value)}
                />
                <span style={coordLabel}>步长</span>
                <input
                  style={{ ...inputSm, width: "42px" }}
                  type="number"
                  step="0.1"
                  value={s.params.step}
                  onChange={(e) => updateSlider(i, "step", e.target.value)}
                />
                <button onClick={() => removeSlider(i)} style={delBtn}>×</button>
              </div>
            ))}
          </Section>

          {/* Confirm button — always visible */}
          <button
            onClick={() => {
              console.log("[GeometryBuilder] 确定构造 clicked, elements:", elements);
              if (onApply) onApply();
            }}
            disabled={totalCount === 0}
            style={{
              width: "100%", marginTop: "8px", padding: "8px 0",
              border: "none", borderRadius: "8px",
              background: totalCount > 0
                ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                : "#e2e8f0",
              color: totalCount > 0 ? "#fff" : "#94a3b8",
              fontSize: "13px", fontWeight: 700,
              cursor: totalCount > 0 ? "pointer" : "not-allowed",
              boxShadow: totalCount > 0 ? "0 2px 6px rgba(139,92,246,0.3)" : "none",
            }}
          >
            ✓ 确定构造
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title, count, onAdd, disabled, children }) {
  const hasItems = count > 0;
  return (
    <div style={{ marginBottom: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{
          color: hasItems ? "#1e293b" : "#94a3b8",
          fontSize: "10px", fontWeight: 600,
        }}>
          {title} {hasItems ? `(${count})` : ""}
        </span>
        <button
          onClick={onAdd}
          disabled={disabled}
          style={{
            padding: "2px 10px",
            border: "1px solid #8b5cf6",
            borderRadius: "6px",
            background: "rgba(139,92,246,0.08)",
            color: "#7c3aed",
            fontSize: "10px", fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.35 : 1,
          }}
        >
          ＋ {title}
        </button>
      </div>
      {children}
    </div>
  );
}

const rowStyle = {
  display: "flex", gap: "3px", alignItems: "center",
  marginBottom: "3px", padding: "4px 6px",
  background: "rgba(248,250,252,0.7)",
  borderRadius: "6px",
};

const inputSm = {
  flex: 1,
  padding: "4px 6px",
  border: "1px solid #e2e8f0",
  borderRadius: "5px",
  fontSize: "10px",
  color: "#1e293b",
  background: "#fff",
  outline: "none",
  minWidth: 0,
};

const coordLabel = {
  color: "#94a3b8",
  fontSize: "9px",
  fontWeight: 600,
  flexShrink: 0,
};

const delBtn = {
  padding: "2px 6px",
  border: "none",
  borderRadius: "4px",
  background: "rgba(239,68,68,0.12)",
  color: "#ef4444",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
  lineHeight: 1,
  flexShrink: 0,
};
