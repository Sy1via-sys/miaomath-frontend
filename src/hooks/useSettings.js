import { useState, useCallback } from "react";

const STORAGE_KEY = "math_solver_api_settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { endpoint: "", apiKey: "", model: "qwen-vl-max" };
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  const hasSettings = !!(settings.endpoint && settings.apiKey);

  return { settings, saveSettings, hasSettings };
}
