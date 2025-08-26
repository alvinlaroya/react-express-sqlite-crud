import { summarizeOrders, type Order } from '@/lib/summarize';

describe('summarizeOrders', () => {
  test('computes totals, median (odd), top product, unique count', () => {
    const orders: Order[] = [
      { id: 1, product: 'A', qty: 2, price: 10 }, // 20
      { id: 2, product: 'B', qty: 1, price: 15 }, // 15
      { id: 3, product: 'A', qty: 3, price: 5 },  // 15
    ];
    const s = summarizeOrders(orders);
    expect(s.totalRevenue).toBe(50);
    expect(s.medianOrderPrice).toBe(15);
    expect(s.topProductByQty).toBe('A');
    expect(s.uniqueProductCount).toBe(2);
  });

  test('median even count and empty edge cases', () => {
    const evenOrders: Order[] = [
      { id: 1, product: 'X', qty: 1, price: 5 },  // 5
      { id: 2, product: 'Y', qty: 2, price: 10 }, // 20
      { id: 3, product: 'Z', qty: 1, price: 15 }, // 15
      { id: 4, product: 'X', qty: 2, price: 5 },  // 10
    ];
    const e = summarizeOrders(evenOrders);
    // sorted revenues: [5,10,15,20] median = (10+15)/2 = 12.5
    expect(e.medianOrderPrice).toBe(12.5);

    const empty = summarizeOrders([]);
    expect(empty.totalRevenue).toBe(0);
    expect(empty.medianOrderPrice).toBe(0);
    expect(empty.topProductByQty).toBe('');
    expect(empty.uniqueProductCount).toBe(0);
  });
});


