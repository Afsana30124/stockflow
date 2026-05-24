# StockFlow - Inventory Reservation System

A full-stack inventory reservation system built with Next.js, Prisma, PostgreSQL, and Tailwind CSS.

---

# Features

- Product listing with warehouse stock
- Real-time inventory reservation
- Reservation expiry countdown timer
- Confirm purchase
- Cancel reservation
- Automatic stock updates
- Reservation release handling
- Responsive UI
- PostgreSQL database with Prisma ORM

---

# Tech Stack

## Frontend
- Next.js 15
- React
- Tailwind CSS
- React Hot Toast

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase)

## Deployment
- Vercel

---

# Live Demo

https://stockflow-a2ik-3u5i62izv-afsana-s-projects1.vercel.app/

---

# GitHub Repository

https://github.com/Afsana30124/stockflow

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/Afsana30124/stockflow.git
cd stockflow
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@host:5432/database"
```

---

## 4. Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Push schema to database:

```bash
npx prisma db push
```

---

## 5. Seed Database

Run:

```bash
npx prisma db seed
```

---

## 6. Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Database Seed

Create:

```text
prisma/seed.ts
```

Example seed file:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const product = await prisma.product.create({
    data: {
      name: "iPhone 15",
    },
  });

  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product.id,
      warehouseId: warehouse.id,
      totalUnits: 20,
      reservedUnits: 0,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Add this to `package.json`:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Install tsx:

```bash
npm install -D tsx
```

Run seed:

```bash
npx prisma db seed
```

---

# Reservation Expiry Mechanism

Each reservation stores an `expiresAt` timestamp in PostgreSQL.

When a reservation is created:
- Reserved stock count increases
- Expiry time is set to 15 minutes

During confirmation:
- Backend validates reservation status
- Expired reservations return HTTP 410

During cancellation:
- Reserved units are released back to inventory
- Reservation status becomes `released`

The frontend also displays a live countdown timer.

---

# Production Deployment

## Frontend and API
- Hosted on Vercel

## Database
- Supabase PostgreSQL

## Environment Variables
- DATABASE_URL

---

# Trade-offs / Improvements

If given more time, I would improve:

- Background cron job for automatic expiry cleanup
- Redis-based distributed locking
- Better authentication and session management
- Optimistic UI updates
- Unit and integration testing
- WebSocket-based live stock updates
- Better loading skeletons and accessibility
- Docker containerization

---

# Author

Afsana Khatoon
