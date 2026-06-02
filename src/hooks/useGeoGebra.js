import { useState, useCallback } from "react";
import { getGeogebraCommands } from "../api/client";

export function useGeoGebra() {
  const [loading, setLoading] = useState(false);
  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);

  const generate = useCallback(async (latex, order) => {
    setLoading(true);
    setError(null);
    setCommands([]);
    try {
      const data = await getGeogebraCommands(latex, order);
      setCommands(data.commands || []);
      return data.commands || [];
    } catch (err) {
      const msg = err.message || "生成图像失败";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, commands, error };
}
