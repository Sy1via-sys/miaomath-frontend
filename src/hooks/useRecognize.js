import { useState, useCallback } from "react";
import { recognizeImage } from "../api/client";

export function useRecognize() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const recognize = useCallback(async (imageBase64, model, mime = "image/jpeg") => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await recognizeImage(imageBase64, model, mime);
      setResult(data);
      return data;
    } catch (err) {
      const msg = err.message || "识别失败";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { recognize, loading, result, error };
}
