import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../services/httpClient";

interface UseApiResourceOptions<T> {
  load: () => Promise<T>;
  initialData: T;
  enabled?: boolean;
}

export interface UseApiResourceResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiResource<T>({
  load,
  initialData,
  enabled = true,
}: UseApiResourceOptions<T>): UseApiResourceResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    load()
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, load, reloadKey]);

  return { data, loading, error, refetch };
}
