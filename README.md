# BarBooks Assessment Documentation

## Backend (Node.js, Express, SQLite)

### Overview
The backend is a RESTful API built with Express and SQLite. It manages product orders and provides summary statistics.

#### Main Features
- **Endpoints:**
  - `GET /api/summary`: Returns total revenue, median order price, top product by quantity, and unique product count.
  - `GET /api/orders`: Lists orders, supports filtering by product, pagination.
  - `POST /api/orders`: Creates a new order (validates product, qty, price).

#### Project Structure
- `index.ts`: Entry point, sets up Express and SQLite.
- `src/app.ts`: Express app and routes.
- `src/db.ts`: SQLite database setup.
- `src/controllers/order.controller.ts`: API logic.
- `src/models/order.model.ts`: DB queries.
- `src/utils/summarize.ts`: Summary logic.

#### How to Run
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Set environment variables in `backend/.env`:
   ```
   PORT=3001
   DB_PATH=./data.db
   ```
3. Database Seeder:
   ```bash
   npm run seed
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Or build and run:
   ```bash
   npm run build
   npm start
   ```
5. Run tests:
   ```bash
   npm test
   ```

---

## Frontend (Next.js, Tailwind, shadcn-style UI)

### Overview
The frontend is a Next.js app using Tailwind v4 and custom shadcn-style UI components. It interacts with the backend API.

#### Main Features
- **Pages:**
  - Home: Shows summary cards and orders list.
  - Order form: Create new orders.
- **Hooks:** `useOrders`, `useSummary`
- **API Client:** `lib/api.ts`
- **Unit Tests:** Jest for core logic.

#### Project Structure
- `app/`: Next.js pages.
- `components/`: UI components.
- `hooks/`: Data fetching hooks.
- `lib/`: API client and core logic.
- `__tests__/`: Unit tests.

#### How to Run
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Configure environment:
   - Create `frontend/.env.local`:
     ```
     NEXT_PUBLIC_API_BASE=http://localhost:3001
     ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

4. Run tests:
   ```bash
   npm test
   ```

---

## Notes
- Make sure the backend is running before starting the frontend.
- Adjust API URLs in `.env.local` as needed.
- Both projects have their own dependencies and scripts.
