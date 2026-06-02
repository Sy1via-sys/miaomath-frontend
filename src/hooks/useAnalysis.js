import { useState, useCallback } from "react";
import { analyzeFunction } from "../api/client";

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (latex, order) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeFunction(latex, order);
      setResult(data);
      return data;
    } catch (err) {
      const msg = err.message || "分析失败";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, result, error };
}
