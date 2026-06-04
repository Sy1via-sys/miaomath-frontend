import { useEffect, useMemo, useRef } from "react";

const LABELS = ["原函数", "一阶导数", "二阶导数", "三阶导数"];
const COLORS = ["#ef4444", "#f97316", "#7c3aed", "#3b82f6"];
const BG_COLORS = ["#fef2f2", "#fff7ed", "#f3e8ff", "#eff6ff"];

function buildSrcdoc(commands) {
  const lines = commands.map(c => JSON.stringify(c)).join(",\n        ");
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>GeoGebra</title></head>
<body>
<div id="ggb" style="width:100%;height:100vh;"></div>
<script src="https://www.geogebra.org/apps/deployggb.js"><\/script>
<script>
new window.GGBApplet({
  appName: "classic",
  showToolBar: false, showAlgebraInput: false, showMenuBar: false,
  showResetIcon: false, enableShiftDragZoom: true, language: "zh",
  appletOnLoad: function(api) {
    setTimeout(function() {
      var cmds = [
        ${lines}
      ];
      cmds.forEach(function(c) {
        if (c === 'ZoomAll()' || c === 'zoomAll()') return;
        api.evalCommand(c);
      });
      api.zoomAll();
    }, 800);
  }
}, true).inject("ggb");
<\/script>
</body></html>`;
}

export default function GraphCanvas({ commands = [] }) {
  const blobUrl = useMemo(() => {
    if (!commands || commands.length === 0) return null;
    const html = buildSrcdoc(commands);
    const blob = new Blob([html], { type: "text/html" });
    return URL.createObjectURL(blob);
  }, [commands]);

  const prevUrlRef = useRef(null);
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);
  useEffect(() => {
    const prev = prevUrlRef.current;
    prevUrlRef.current = blobUrl;
    return () => { if (prev) URL.revokeObjectURL(prev); };
  }, [blobUrl]);

  return (
    <div style={{
      flex: 1, background: "#fff", borderRadius: "10px",
      border: "1px solid #e2e8f0", padding: "10px",
      display: "flex", flexDirection: "column", minHeight: "150px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
        {commands.map((_, i) => {
          const idx = i % COLORS.length;
          return (
            <span key={i} style={{
              background: BG_COLORS[idx], color: COLORS[idx],
              padding: "2px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
            }}>
              {LABELS[i] || `${i}阶导数`}
            </span>
          );
        })}
      </div>
      {blobUrl ? (
        <iframe
          key={blobUrl}
          src={blobUrl}
          title="GeoGebra"
          style={{ flex: 1, minHeight: 0, border: "none", borderRadius: "8px" }}
        />
      ) : (
        <div style={{ flex: 1, minHeight: 0 }} />
      )}
    </div>
  );
}
