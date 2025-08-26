import request from 'supertest';
import sqlite3 from 'sqlite3';
import { createApp } from '../src/app';

describe('POST /api/orders Integration', () => {
	let app: Express.Application;
	let db: sqlite3.Database;

	beforeEach((done) => {
		// Create in-memory database for each test
		db = new sqlite3.Database(':memory:', (err) => {
			if (err) {
				done(err);
				return;
			}

			// Create schema
			db.serialize(() => {
				db.run(
					`CREATE TABLE IF NOT EXISTS orders (
						id INTEGER PRIMARY KEY AUTOINCREMENT,
						product TEXT NOT NULL,
						qty INTEGER NOT NULL,
						price REAL NOT NULL
					)`,
					(err) => {
						if (err) {
							done(err);
							return;
						}
						app = createApp(db);
						done();
					}
				);
			});
		});
	});

	afterEach((done) => {
		db.close(done);
	});

	it('should create a valid order and return it correctly', async () => {
		const orderData = {
			product: 'Test Product',
			qty: 5,
			price: 29.99
		};

		const response = await request(app as any)
			.post('/api/orders')
			.send(orderData)
			.expect(201);

		// Verify response
		expect(response.body).toHaveProperty('id');
		expect(response.body).toHaveProperty('product', orderData.product);
		expect(response.body).toHaveProperty('qty', orderData.qty);
		expect(response.body).toHaveProperty('price', orderData.price);
		expect(typeof response.body.id).toBe('number');
		expect(response.body.id).toBeGreaterThan(0);

		// Verify order actually inserted in db
		const getResponse = await request(app as any)
			.get('/api/orders')
			.expect(200);

		expect(getResponse.body.data).toHaveLength(1);
		expect(getResponse.body.data[0]).toMatchObject({
			id: response.body.id,
			product: orderData.product,
			qty: orderData.qty,
			price: orderData.price
		});
	});

	it('should handle string numbers in request body', async () => {
		const orderData = {
			product: 'String Numbers Test',
			qty: '3',
			price: '19.50'
		};

		const response = await request(app as any)
			.post('/api/orders')
			.send(orderData)
			.expect(201);

		expect(response.body).toMatchObject({
			product: orderData.product,
			qty: 3,
			price: 19.50
		});
	});

	it('should reject invalid order data', async () => {
		const invalidOrderData = {
			product: '',
			qty: 0,
			price: -10
		};

		const response = await request(app as any)
			.post('/api/orders')
			.send(invalidOrderData)
			.expect(400);

		expect(response.body).toHaveProperty('error', 'Validation error');
		expect(response.body).toHaveProperty('details');
	});
});
