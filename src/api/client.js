import API_BASE from "./config";

function authHeaders() {
  const token = localStorage.getItem("miaomath_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function ocrImage(imageBase64, mime = "image/jpeg") {
  const response = await fetch(`${API_BASE}/ocr`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ image: imageBase64, mime }),
  });
  if (!response.ok) throw new Error(`OCR failed: ${response.status}`);
  return response.json();
}

export async function recognizeImage(imageBase64, model = "qwen-vl-max", mime = "image/jpeg") {
  const response = await fetch(`${API_BASE}/recognize`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ image: imageBase64, model, mime }),
  });
  if (!response.ok) throw new Error(`Recognition failed: ${response.status}`);
  return response.json();
}

export async function analyzeFunction(latex, order = 2) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ latex, order }),
  });
  if (!response.ok) throw new Error(`Analysis failed: ${response.status}`);
  return response.json();
}

export async function getGeogebraCommands(latex, order = 2, type = "function", geometryElements = [], graphSpec = null) {
  const response = await fetch(`${API_BASE}/geogebra`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ latex, order, type, geometry_elements: geometryElements, graph_spec: graphSpec }),
  });
  if (!response.ok) throw new Error(`GeoGebra failed: ${response.status}`);
  return response.json();
}

export async function getSolution(type, expressions, latex, model = "deepseek-chat", graphSpec = null) {
  const response = await fetch(`${API_BASE}/solution`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ type, expressions, latex, model, graph_spec: graphSpec }),
  });
  if (!response.ok) throw new Error(`Solution failed: ${response.status}`);
  return response.json();
}

export async function exportGraph(commands, format, title = "Math Graph") {
  const response = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: authHeaders(),
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
      const base64 = comma >= 0 ? result.slice(comma + 1) : result;
      resolve({ base64, mime: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
