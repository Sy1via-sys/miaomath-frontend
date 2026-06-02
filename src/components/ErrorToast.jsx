import { useEffect } from "react";

export default function ErrorToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", background: "#ef4444", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, zIndex: 1000, boxShadow: "0 4px 12px rgba(239,68,68,0.3)", maxWidth: "360px", cursor: "pointer" }}
      onClick={onClose}>{message}</div>
  );
}
