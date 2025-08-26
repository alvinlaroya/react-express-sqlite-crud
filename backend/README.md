# BarBooks Assessment Backend

A RESTful API built with Express and SQLite for managing product orders and providing summary statistics.

## Endpoints
- `GET /api/summary`: Returns total revenue, median order price, top product by quantity, and unique product count.
- `GET /api/orders`: Lists orders, supports filtering by product, pagination.
- `POST /api/orders`: Creates a new order (validates product, qty, price).

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Set environment variables in `.env`:
   ```
   PORT=3001
   DB_PATH=./data.db
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   Or build and run:
   ```bash
   npm run build
   npm start
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Project Structure
- `index.ts`: Entry point
- `src/app.ts`: Express app and routes
- `src/db.ts`: SQLite setup
- `src/controllers/order.controller.ts`: API logic
- `src/models/order.model.ts`: DB queries
- `src/utils/summarize.ts`: Summary logic
