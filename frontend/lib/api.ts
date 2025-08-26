export type OrderInput = {
  product: string;
  qty: number;
  price: number;
};

export type Order = {
  id: number;
} & OrderInput;

export type Summary = {
  totalRevenue: number;
  medianOrderPrice: number;
  topProductByQty: string;
  uniqueProductCount: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  async getSummary(): Promise<Summary> {
    return fetchAPI<Summary>('/api/summary');
  },

  async getOrders(params?: {
    product?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    const searchParams = new URLSearchParams();

    if (params?.product) searchParams.append('product', params.product);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    const path = query ? `/api/orders?${query}` : '/api/orders';

    const response = await fetchAPI<{ data: Order[] }>(path);
    return response.data;
  },

  async createOrder(order: OrderInput): Promise<Order> {
    return fetchAPI<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },
};


