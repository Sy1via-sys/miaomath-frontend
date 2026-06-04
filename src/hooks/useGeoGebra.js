import { useState, useCallback } from "react";
import { getGeogebraCommands } from "../api/client";

export function useGeoGebra() {
  const [loading, setLoading] = useState(false);
  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);

  const generate = useCallback(async (latex, order, type = "function", geometryElements = [], graphSpec = null) => {
    setLoading(true);
    setError(null);
    setCommands([]);
    try {
      const data = await getGeogebraCommands(latex, order, type, geometryElements, graphSpec);
      setCommands(data.commands || []);
      return data;
    } catch (err) {
      const msg = err.message || "生成图像失败";
      setError(msg);
      setCommands([]);
      return { success: false, commands: [], error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, commands, error };
}
