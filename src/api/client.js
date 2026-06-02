const API_BASE = "/api";

export async function ocrImage(imageBase64) {
  const response = await fetch(`${API_BASE}/ocr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
  if (!response.ok) throw new Error(`OCR request failed: ${response.status}`);
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

export async function getGeogebraCommands(latex, order = 2) {
  const response = await fetch(`${API_BASE}/geogebra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latex, order }),
  });
  if (!response.ok) throw new Error(`GeoGebra request failed: ${response.status}`);
  return response.json();
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
