import { useEffect, useRef } from "react";

const LABELS = ["原函数", "一阶导数", "二阶导数", "三阶导数"];
const COLORS = ["#ef4444", "#f97316", "#7c3aed", "#3b82f6"];
const BG_COLORS = ["#fef2f2", "#fff7ed", "#f3e8ff", "#eff6ff"];

export default function GraphCanvas({ index, command }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !command) return;
    const container = containerRef.current;
    container.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.geogebra.org/graphing?appName=graphing&showToolBar=false&showAlgebraInput=false&showMenuBar=false&enableShiftDragZoom=true&showResetIcon=true&language=zh`;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "6px";
    container.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.postMessage(
          { command: "eval", value: command },
          "https://www.geogebra.org"
        );
      }, 1200);
    };

    return () => { container.innerHTML = ""; };
  }, [command]);

  const idx = index % COLORS.length;

  return (
    <div style={{
      flex: 1, background: "#fff", borderRadius: "10px",
      border: "1px solid #e2e8f0", padding: "10px",
      display: "flex", flexDirection: "column", minHeight: "150px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{
          background: BG_COLORS[idx], color: COLORS[idx],
          padding: "2px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
        }}>
          {LABELS[index] || `${index}阶导数`}
        </span>
      </div>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
}
