import sqlite3 from 'sqlite3';
import { type Order } from '../utils/summarize';

export function getAllOrders(db: sqlite3.Database): Promise<Order[]> {
	return new Promise((resolve, reject) => {
		db.all('SELECT id, product, qty, price FROM orders', (err: Error | null, rows: Order[]) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
}

export function getOrdersWithFilters(
	db: sqlite3.Database,
	product?: string,
	limit?: number,
	offset?: number
): Promise<Order[]> {
	return new Promise((resolve, reject) => {
		const whereClauses: string[] = [];
		const params: Array<string | number> = [];
		
		if (product && String(product).trim() !== '') {
			whereClauses.push('product LIKE ?');
			params.push(`%${String(product).trim()}%`);
		}
		
		const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

		let paginationSql = '';
		if (limit && limit > 0) {
			paginationSql += ' LIMIT ?';
			params.push(limit);
		}
		if (offset && offset >= 0) {
			paginationSql += params.length && paginationSql.includes('LIMIT') ? ' OFFSET ?' : ' LIMIT -1 OFFSET ?';
			params.push(offset);
		}

		const sql = `SELECT id, product, qty, price FROM orders ${whereSql} ORDER BY id DESC ${paginationSql}`;
		
		db.all(sql, params, (err: Error | null, rows: Order[]) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
}

export function createOrder(db: sqlite3.Database, product: string, qty: number, price: number): Promise<Order> {
	return new Promise((resolve, reject) => {
		const insertSql = 'INSERT INTO orders (product, qty, price) VALUES (?, ?, ?)';
		db.run(insertSql, [product, qty, price], function (this: sqlite3.RunResult, err: Error | null) {
			if (err) {
				reject(err);
				return;
			}
			const newOrder: Order = { id: this.lastID, product, qty, price };
			resolve(newOrder);
		});
	});
}
