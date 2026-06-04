import { useState, useCallback } from "react";

const STORAGE_KEY = "math_solver_api_settings_v2";

function defaultSettings() {
  return {
    model: "qwen-vl-max",
    solutionModel: "deepseek-chat",
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...defaultSettings(), ...saved };
    }
  } catch {}
  return defaultSettings();
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  return { settings, saveSettings, hasSettings: true, hasSolutionSettings: true };
}
