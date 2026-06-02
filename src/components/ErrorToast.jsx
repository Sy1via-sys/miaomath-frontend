import { useEffect } from "react";

export default function ErrorToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#f85149",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: 500,
      zIndex: 1000,
      boxShadow: "0 4px 12px rgba(248,81,73,0.3)",
      maxWidth: "360px",
      cursor: "pointer",
    }} onClick={onClose}>
      {message}
    </div>
  );
}
