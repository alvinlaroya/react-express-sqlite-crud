import sqlite3 from 'sqlite3';
import { type Order } from '../utils/summarize';

// Get all orders
export function getAllOrders(db: sqlite3.Database): Promise<Order[]> {
	return new Promise((resolve, reject) => {
		db.all('SELECT * FROM orders', (err, rows: Order[]) => {
			err ? reject(err) : resolve(rows);
		});
	});
}

// Get orders with optional filters
export function getOrdersWithFilters(
	db: sqlite3.Database,
	product?: string,
	limit?: number,
	offset?: number
): Promise<Order[]> {
	return new Promise((resolve, reject) => {
		let sql = 'SELECT * FROM orders';
		const params: any[] = [];
		
		if (product) {
			sql += ' WHERE product LIKE ?';
			params.push(`%${product}%`);
		}
		
		sql += ' ORDER BY id DESC';
		
		if (limit) {
			sql += ' LIMIT ?';
			params.push(limit);
		}
		
		if (offset) {
			sql += ' OFFSET ?';
			params.push(offset);
		}
		
		db.all(sql, params, (err, rows: Order[]) => {
			err ? reject(err) : resolve(rows);
		});
	});
}

// Create new order
export function createOrder(
	db: sqlite3.Database,
	product: string,
	qty: number,
	price: number
): Promise<Order> {
	return new Promise((resolve, reject) => {
		db.run('INSERT INTO orders (product, qty, price) VALUES (?, ?, ?)', 
			[product, qty, price], 
			function(err) {
				if (err) reject(err);
				else resolve({ id: this.lastID, product, qty, price });
			}
		);
	});
}