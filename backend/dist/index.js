"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 3001);
const dbPath = process.env.DB_PATH || path_1.default.join(__dirname, 'data.db');
// Basic logging middleware
app.use((req, res, next) => {
    const startTimeMs = Date.now();
    res.on('finish', () => {
        const durationMs = Date.now() - startTimeMs;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`);
    });
    next();
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize SQLite
const sqlite = sqlite3_1.default.verbose();
const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
        process.exit(1);
    }
    console.log(`SQLite DB opened at ${dbPath}`);
});
// Create schema if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			product TEXT NOT NULL,
			qty INTEGER NOT NULL,
			price REAL NOT NULL
		)`);
});
function summarizeOrders(rows) {
    let totalRevenue = 0;
    const prices = [];
    const productToQty = new Map();
    const uniqueProducts = new Set();
    for (const row of rows) {
        totalRevenue += row.qty * row.price;
        prices.push(row.price);
        uniqueProducts.add(row.product);
        const currentQty = productToQty.get(row.product) || 0;
        productToQty.set(row.product, currentQty + row.qty);
    }
    prices.sort((a, b) => a - b);
    let medianOrderPrice = 0;
    if (prices.length > 0) {
        const mid = Math.floor(prices.length / 2);
        medianOrderPrice = prices.length % 2 === 0 ? (prices[mid - 1] + prices[mid]) / 2 : prices[mid];
    }
    let topProductByQty = '';
    let maxQty = -Infinity;
    for (const [product, qty] of productToQty.entries()) {
        if (qty > maxQty) {
            maxQty = qty;
            topProductByQty = product;
        }
    }
    return {
        totalRevenue,
        medianOrderPrice,
        topProductByQty,
        uniqueProductCount: uniqueProducts.size,
    };
}
app.get('/api/summary', (_req, res) => {
    db.all('SELECT id, product, qty, price FROM orders', (err, rows) => {
        if (err) {
            console.error('DB error on summary:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        const summary = summarizeOrders(rows);
        return res.json(summary);
    });
});
app.get('/api/orders', (req, res) => {
    const { product, limit, offset } = req.query;
    const whereClauses = [];
    const params = [];
    if (product && String(product).trim() !== '') {
        whereClauses.push('product LIKE ?');
        params.push(`%${String(product).trim()}%`);
    }
    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    let paginationSql = '';
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    if (!Number.isNaN(limitNum) && limitNum > 0) {
        paginationSql += ' LIMIT ?';
        params.push(limitNum);
    }
    if (!Number.isNaN(offsetNum) && offsetNum >= 0) {
        paginationSql += params.length && paginationSql.includes('LIMIT') ? ' OFFSET ?' : ' LIMIT -1 OFFSET ?';
        params.push(offsetNum);
    }
    const sql = `SELECT id, product, qty, price FROM orders ${whereSql}${paginationSql}`;
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('DB error on list orders:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ data: rows });
    });
});
app.post('/api/orders', (req, res) => {
    const { product, qty, price } = (req.body || {});
    if (typeof product !== 'string' || product.trim() === '') {
        return res.status(400).json({ error: 'Invalid product' });
    }
    if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ error: 'Invalid qty' });
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
        return res.status(400).json({ error: 'Invalid price' });
    }
    const insertSql = 'INSERT INTO orders (product, qty, price) VALUES (?, ?, ?)';
    db.run(insertSql, [product.trim(), qty, priceNum], function (err) {
        if (err) {
            console.error('DB error on insert order:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        const newOrder = { id: this.lastID, product: product.trim(), qty: qty, price: priceNum };
        return res.status(201).json(newOrder);
    });
});
app.get('/', (_req, res) => {
    res.json({ ok: true });
});
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
process.on('SIGINT', () => {
    console.log('Shutting down...');
    db.close(() => process.exit(0));
});
