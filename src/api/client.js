const API_BASE = "/api";

export async function ocrImage(imageBase64) {
  const response = await fetch(`${API_BASE}/ocr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
  if (!response.ok) throw new Error(`OCR failed: ${response.status}`);
  return response.json();
}

export async function recognizeImage(imageBase64, endpoint, apiKey, model) {
  const response = await fetch(`${API_BASE}/recognize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64, endpoint, api_key: apiKey, model }),
  });
  if (!response.ok) throw new Error(`Recognition failed: ${response.status}`);
  return response.json();
}

export async function analyzeFunction(latex, order = 2) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latex, order }),
  });
  if (!response.ok) throw new Error(`Analysis failed: ${response.status}`);
  return response.json();
}

export async function getGeogebraCommands(latex, order = 2, type = "function", geometryElements = []) {
  const response = await fetch(`${API_BASE}/geogebra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latex, order, type, geometry_elements: geometryElements }),
  });
  if (!response.ok) throw new Error(`GeoGebra failed: ${response.status}`);
  return response.json();
}

export async function exportGraph(commands, format, title = "Math Graph") {
  const response = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commands, format, title }),
  });
  if (!response.ok) throw new Error(`Export failed: ${response.status}`);
  return response.blob();
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
