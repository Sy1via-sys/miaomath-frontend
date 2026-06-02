import { useEffect, useRef } from "react";

const LABELS = ["原函数", "一阶导数", "二阶导数", "三阶导数"];
const COLORS = ["#e94560", "#f0883e", "#d2a8ff", "#79c0ff"];

export default function GraphCanvas({ index, command, onMount }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !command) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const params = {
      appName: "graphing",
      width: container.clientWidth,
      height: container.clientHeight,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      enableShiftDragZoom: true,
      showResetIcon: true,
      language: "zh",
    };

    const urlParams = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.geogebra.org/graphing?${urlParams}`;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "6px";
    iframe.title = LABELS[index] || `${index}阶导数`;
    container.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.postMessage(
          { command: "eval", value: command },
          "https://www.geogebra.org"
        );
      }, 1500);
    };

    return () => {
      container.innerHTML = "";
    };
  }, [command, index]);

  return (
    <div style={{
      flex: 1,
      background: "#161b22",
      borderRadius: "8px",
      border: `1px solid ${COLORS[index % COLORS.length] || "#30363d"}`,
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      minHeight: "180px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{
          background: COLORS[index % COLORS.length] || "#30363d",
          color: index === 2 ? "#0d1117" : "#fff",
          padding: "2px 10px",
          borderRadius: "4px",
          fontSize: "11px",
          fontWeight: 700,
        }}>
          {LABELS[index] || `${index}阶导数`}
        </span>
      </div>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
}
