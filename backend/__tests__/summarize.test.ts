import { summarizeOrders, type Order, type Summary } from '../src/utils/summarize';

describe('summarizeOrders', () => {
	it('computes summary for typical dataset', () => {
		const rows: Order[] = [
			{ id: 1, product: 'CPU - AMD Ryzen 7 7800X3D', qty: 2, price: 10 },
			{ id: 2, product: 'Widget B', qty: 1, price: 5 },
			{ id: 3, product: 'CPU - AMD Ryzen 7 7800X3D', qty: 3, price: 12 },
		];

		const result: Summary = summarizeOrders(rows);
		expect(result.totalRevenue).toBeCloseTo(2 * 10 + 1 * 5 + 3 * 12, 6);
		// totals sorted [5,20,36] => median 20
		expect(result.medianOrderPrice).toBe(20);
		expect(result.topProductByQty).toBe('CPU - AMD Ryzen 7 7800X3D');
		expect(result.uniqueProductCount).toBe(2);
	});

	it('handles empty input (edge case)', () => {
		const rows: Order[] = [];
		const result: Summary = summarizeOrders(rows);
		expect(result.totalRevenue).toBe(0);
		expect(result.medianOrderPrice).toBe(0);
		expect(result.topProductByQty).toBe('');
		expect(result.uniqueProductCount).toBe(0);
	});

	it('computes median for even number of orders using totals', () => {
		const rows: Order[] = [
			{ id: 1, product: 'P1', qty: 1, price: 10 }, // 10
			{ id: 2, product: 'P2', qty: 2, price: 10 }, // 20
			{ id: 3, product: 'P3', qty: 3, price: 10 }, // 30
			{ id: 4, product: 'P4', qty: 4, price: 10 }, // 40
		];
		const result: Summary = summarizeOrders(rows);
		// totals sorted [10,20,30,40] => median = (20 + 30) / 2 = 25
		expect(result.medianOrderPrice).toBe(25);
		expect(result.totalRevenue).toBe(100);
		expect(result.uniqueProductCount).toBe(4);
	});
});


