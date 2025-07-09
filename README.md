# InventoryPro

A modern inventory management system built with Next.js, tRPC, Prisma, and Tailwind CSS.

## Features
- Inventory CRUD (Create, Read, Update, Delete)
- Status, category, and location management
- Analytics and quick insights dashboard
- Responsive UI for desktop and mobile
- Data stored in PostgreSQL via Prisma ORM

## Getting Started

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd project-ref1
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up the Database
- Ensure you have PostgreSQL running locally.
- Create a database (e.g., `inventory`).
- Copy `.env.example` to `.env` and set your `DATABASE_URL`:
  ```env
  DATABASE_URL="postgresql://postgres:Skit@1234@localhost:5432/inventory"
  ```

### 4. Run Prisma Migrations
```sh
npx prisma migrate dev --name init
```

### 5. (Optional) Seed Some Data
You can add products via the app UI, or use Prisma Studio:
```sh
npx prisma studio
```
- Open http://localhost:5555 and add/edit products directly.

### 6. Start the Development Server
```sh
npm run dev
```
- Open http://localhost:3000 (or the port shown in your terminal).

## Usage
- **Inventory:** Add, edit, delete, and filter products.
- **Dashboard:** See quick stats and recent activity.
- **Reports:** View quick insights and a detailed product table.
- **Settings:** Adjust preferences (theme, notifications, etc.).

## Operations
- **Add Product:** Click "Add Product" on the Inventory page, fill the form, and submit.
- **Edit Product:** Click the edit icon on a product card.
- **Delete Product:** Click the delete icon and confirm.
- **Update Status:** Click the status icon and select a new status.
- **View History:** Click the history icon on a product card.

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- tRPC (API routing)
- Prisma (ORM)
- PostgreSQL (database)
- Tailwind CSS (styling)
- Recharts (charts)

## Troubleshooting
- If you see errors about missing database, check your `.env` and ensure PostgreSQL is running.
- For tRPC errors, ensure you are not using `next export` and are running in server mode.
- Use `npx prisma studio` to inspect and edit your data visually.

