import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { getSummary, getOrders, createOrderHandler } from './controllers/order.controller';

export function createApp(db: sqlite3.Database) {
	const app = express();

	// Logging middleware
	app.use((req: Request, res: Response, next: NextFunction) => {
		const startTimeMs = Date.now();
		res.on('finish', () => {
			const durationMs = Date.now() - startTimeMs;
			console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`);
		});
		next();
	});
	app.use(cors());
	app.use(express.json());

	// Get Summary Endpoint
	app.get('/api/summary', (req: Request, res: Response) => {
		getSummary(req, res, db);
	});

	// Get Orders Endpoint
	app.get('/api/orders', (req: Request, res: Response) => {
		getOrders(req, res, db);
	});

	// Create Order Endpoint
	app.post('/api/orders', (req: Request, res: Response) => {
		createOrderHandler(req, res, db);
	});

	app.get('/', (_req: Request, res: Response) => {
		res.json({ ok: true });
	});

	return app;
}
