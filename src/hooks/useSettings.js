import { useState, useCallback } from "react";

const STORAGE_KEY = "math_solver_api_settings_v2";

function defaultSettings() {
  return {
    endpoint: "",
    apiKey: "",
    model: "qwen-vl-max",
    solutionEndpoint: "",
    solutionApiKey: "",
    solutionModel: "deepseek-chat",
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Merge with defaults to add any missing fields
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

  const hasSettings = !!(settings.endpoint && settings.apiKey);
  const hasSolutionSettings = !!(settings.solutionEndpoint && settings.solutionApiKey);

  return { settings, saveSettings, hasSettings, hasSolutionSettings };
}
