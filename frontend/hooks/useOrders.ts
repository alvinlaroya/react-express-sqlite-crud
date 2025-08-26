import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, type Order, type OrderInput } from '@/lib/api';

export type OrdersQuery = { product?: string; limit?: number; offset?: number };

export function useOrders(initial: OrdersQuery = { limit: 10, offset: 0 }) {
  const [params, setParams] = useState<OrdersQuery>(initial);
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await api.getOrders(params);
      setData(items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const setFilter = useCallback((product?: string) => {
    setParams((p) => ({ ...p, product, offset: 0 }));
  }, []);

  const setPage = useCallback((offset: number) => {
    setParams((p) => ({ ...p, offset }));
  }, []);

  const create = useCallback(async (input: OrderInput) => {
    const created = await api.createOrder(input);
    await fetchList();
    return created;
  }, [fetchList]);

  const page = useMemo(() => ({
    limit: params.limit ?? 10,
    offset: params.offset ?? 0,
  }), [params.limit, params.offset]);

  return { data, loading, error, params, setFilter, setPage, page, refresh: fetchList, create };
}


