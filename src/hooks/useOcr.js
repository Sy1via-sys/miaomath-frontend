import { useState, useCallback } from "react";
import { ocrImage } from "../api/client";

export function useOcr() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const recognize = useCallback(async (imageBase64) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await ocrImage(imageBase64);
      setResult(data);
      return data;
    } catch (err) {
      const msg = err.message || "识别失败";
      setError(msg);
      return { success: false, error: msg, latex: "" };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { recognize, loading, result, error, reset };
}
