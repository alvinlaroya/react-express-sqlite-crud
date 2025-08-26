export type Order = { id: number; product: string; qty: number; price: number };
export type Summary = {
	totalRevenue: number;
	medianOrderPrice: number;
	topProductByQty: string;
	uniqueProductCount: number;
};

export function summarizeOrders(rows: Order[]): Summary {
	const {
		totalRevenue,
		totals,
		productToQty,
		uniqueProducts,
	} = rows.reduce(
		(acc, row) => {
			const total = row.qty * row.price;
			acc.totalRevenue += total;
			acc.totals.push(total);
			acc.uniqueProducts.add(row.product);
			acc.productToQty.set(
				row.product,
				(acc.productToQty.get(row.product) || 0) + row.qty
			);
			return acc;
		},
		{
			totalRevenue: 0,
			totals: [] as number[],
			productToQty: new Map<string, number>(),
			uniqueProducts: new Set<string>(),
		}
	);

	// Median calculation
	totals.sort((a, b) => a - b);
	let medianOrderPrice = 0;
	if (totals.length > 0) {
		const mid = Math.floor(totals.length / 2);
		medianOrderPrice =
			totals.length % 2 === 0
				? (totals[mid - 1] + totals[mid]) / 2
				: totals[mid];
	}

	// Find top product by qty
	const [topProductByQty] = Array.from(productToQty.entries()).reduce(
		(top, entry) => (entry[1] > top[1] ? entry : top),
		['', -Infinity] as [string, number]
	);

	return {
		totalRevenue: Number(totalRevenue.toFixed(2)),
		medianOrderPrice: Number(medianOrderPrice.toFixed(2)),
		topProductByQty,
		uniqueProductCount: uniqueProducts.size,
	};
}




