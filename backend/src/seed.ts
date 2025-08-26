import 'dotenv/config';
import { createDatabase } from './db';

const db = createDatabase(process.env.DB_PATH);

type SeedOrder = { product: string; qty: number; price: number };

const orders: SeedOrder[] = [
	{ product: 'CPU - AMD Ryzen 7 7800X3D', qty: 2, price: 399.99 },
	{ product: 'GPU - NVIDIA GeForce RTX 4070 Ti', qty: 1, price: 799.0 },
	{ product: 'RAM - 32GB DDR5 6000MHz', qty: 3, price: 129.5 },
	{ product: 'SSD - 1TB NVMe Gen4', qty: 4, price: 89.99 },
	{ product: 'Motherboard - X670E ATX', qty: 1, price: 299.0 },
	{ product: 'PSU - 850W 80+ Gold', qty: 2, price: 129.99 },
	{ product: 'Case - Mid Tower Mesh', qty: 1, price: 99.99 },
	{ product: 'CPU Cooler - 360mm AIO', qty: 1, price: 149.99 },
	{ product: 'Keyboard - Mechanical RGB', qty: 2, price: 89.0 },
	{ product: 'Mouse - Wireless 25K DPI', qty: 3, price: 59.99 },
];

function insertOrders(): Promise<void> {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.run('BEGIN TRANSACTION');
			const stmt = db.prepare('INSERT INTO orders (product, qty, price) VALUES (?, ?, ?)');
			for (const o of orders) {
				stmt.run([o.product, o.qty, o.price]);
			}
			stmt.finalize((err) => {
				if (err) {
					return reject(err);
				}
				db.run('COMMIT', (commitErr) => {
					if (commitErr) return reject(commitErr);
					return resolve();
				});
			});
		});
	});
}

insertOrders()
	.then(() => {
		console.log(`Seeded ${orders.length} orders.`);
	})
	.catch((err) => {
		console.error('Seeding failed:', err.message);
	})
	.finally(() => {
		db.close(() => process.exit(0));
	});


