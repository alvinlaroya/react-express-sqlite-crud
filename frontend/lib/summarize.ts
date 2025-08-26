export type Order = { id: number; product: string; qty: number; price: number };

export type Summary = {
  totalRevenue: number;
  medianOrderPrice: number;
  topProductByQty: string;
  uniqueProductCount: number;
};

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const midIndex = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[midIndex - 1] + sorted[midIndex]) / 2;
  }
  return sorted[midIndex];
}

export function summarizeOrders(orders: Order[]): Summary {
  const revenueByOrder = orders.map((o) => o.qty * o.price);
  const totalRevenue = revenueByOrder.reduce((sum, v) => sum + v, 0);

  const productQtyMap = new Map<string, number>();
  for (const order of orders) {
    productQtyMap.set(order.product, (productQtyMap.get(order.product) ?? 0) + order.qty);
  }

  let topProductByQty = "";
  let maxQty = -Infinity;
  for (const [product, qty] of productQtyMap.entries()) {
    if (qty > maxQty) {
      maxQty = qty;
      topProductByQty = product;
    }
  }

  const uniqueProductCount = productQtyMap.size;
  const medianOrderPrice = computeMedian(revenueByOrder);

  return { totalRevenue, medianOrderPrice, topProductByQty, uniqueProductCount };
}


