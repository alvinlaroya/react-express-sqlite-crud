import { useEffect, useState } from 'react';
import { api, type Summary } from '@/lib/api';

export function useSummary() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .getSummary()
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch((e: unknown) => {
        if (mounted) setError((e as Error).message);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error, refresh: () => api.getSummary().then(setData) };
}


