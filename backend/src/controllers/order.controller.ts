import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { summarizeOrders } from '../utils/summarize';
import { getAllOrders, getOrdersWithFilters, createOrder } from '../models/order.model';
import { z } from 'zod';

export async function getSummary(req: Request, res: Response, db: sqlite3.Database): Promise<void> {
	try {
		const rows = await getAllOrders(db);
		const summary = summarizeOrders(rows);
		res.json(summary);
	} catch (err) {
		console.error('DB error on summary:', (err as Error).message);
		res.status(500).json({ error: 'Database error' });
	}
}

export async function getOrders(req: Request, res: Response, db: sqlite3.Database): Promise<void> {
	try {
		const { product, limit, offset } = req.query as { product?: string; limit?: string; offset?: string };
		const limitNum = Number(limit);
		const offsetNum = Number(offset);
		
		const rows = await getOrdersWithFilters(
			db,
			product,
			!Number.isNaN(limitNum) && limitNum > 0 ? limitNum : undefined,
			!Number.isNaN(offsetNum) && offsetNum >= 0 ? offsetNum : undefined
		);
		
		res.json({ data: rows });
	} catch (err) {
		console.error('DB error on list orders:', (err as Error).message);
		res.status(500).json({ error: 'Database error' });
	}
}

export async function createOrderHandler(req: Request, res: Response, db: sqlite3.Database): Promise<void> {
	try {
		const createOrderSchema = z.object({
			product: z.string().trim().min(1, 'product is required'),
			qty: z.coerce.number().int().positive('qty must be a positive integer'),
			price: z.coerce.number().positive('price must be a positive number'),
		});

		const parsed = createOrderSchema.safeParse(req.body ?? {});
		if (!parsed.success) {
			const details = parsed.error.flatten();
			res.status(400).json({ error: 'Validation error', details });
			return;
		}

		const { product, qty, price } = parsed.data;
		const newOrder = await createOrder(db, product, qty, price);
		res.status(201).json(newOrder);
	} catch (err) {
		console.error('DB error on insert order:', (err as Error).message);
		res.status(500).json({ error: 'Database error' });
	}
}
