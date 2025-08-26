# BarBooks Assessment - Frontend (Next.js + shadcn-style UI)

This repository contains the frontend-only implementation for the assessment using Next.js (App Router, TypeScript, Tailwind v4). It integrates:

- UI: minimal shadcn-style components (Card, Button, Input, Label)
- Logic: summarizeOrders with unit tests (Jest + RTL setup)
- Hooks: `useSummary`, `useOrders`
- API Client: `lib/api.ts` for `/api/summary`, `/api/orders`

Note: Backend (Node/Express/SQLite) is assumed to be running separately and exposes the required endpoints. Configure `NEXT_PUBLIC_API_BASE` to point at it.

## Getting Started

1) Install dependencies:
```bash
npm install
```

2) Configure environment:
Create a `.env.local` file at the repo root with:
```bash
NEXT_PUBLIC_API_BASE=http://localhost:3001
```
Adjust the URL/port to your backend.

3) Run the dev server:
```bash
npm run dev
```
Open `http://localhost:3000`.

## Tests

Run unit tests:
```bash
npm test
```

The unit tests cover:
- `summarizeOrders`: totalRevenue, medianOrderPrice (odd/even), topProductByQty, uniqueProductCount

## Project Structure

- `app/` Next.js App Router pages
- `components/ui.tsx` Minimal UI primitives styled for Tailwind v4
- `hooks/useSummary.ts` Fetches `/api/summary`
- `hooks/useOrders.ts` Fetches and creates orders with filter + pagination state
- `lib/api.ts` API client with types
- `lib/summarize.ts` Core logic + types for unit tests
- `__tests__/summarize.test.ts` Jest tests

## UI

Home page renders:
- Summary cards: total revenue, median order price, top product by quantity
- Orders list: filter by product, paginate via offset/limit
- Order form: create new order; on submit, list and summary refresh

## Assumptions

- Backend implements the required endpoints and validation; this repo focuses on the frontend.
- For UI primitives, shadcn init was not used due to Tailwind v4 detection; custom equivalents are provided in `components/ui.tsx`.

## Submission

- Initialize a new Git repository and push to your own remote:
```bash
git init
git add .
git commit -m "feat: frontend for assessment"
# then create a repo on your Git hosting provider and set origin
# e.g. GitHub
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```
