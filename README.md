# products-api

Backend-focused Next.js (App Router) API with MongoDB (Mongoose), seeded from https://dummyjson.com/products.

## Setup
1. Install Node 20+ and MongoDB (Atlas, or `docker run -d --name mongo -p 27017:27017 mongo:7`).
2. `npm install`
3. `cp .env.example .env.local` and set `MONGODB_URI`.
4. `npm run dev`
5. Import data: `curl -X POST http://localhost:3000/api/products/sync`

## Endpoints
| Method | Path | Notes |
|---|---|---|
| POST | /api/products/sync | Upserts all dummyjson products into Mongo |
| GET | /api/products | `?page=&limit=&q=&category=&sort=` |
| POST | /api/products | Create (validated with zod) |
| GET | /api/products/:id | Single product |
| PATCH | /api/products/:id | Partial update |
| DELETE | /api/products/:id | Delete |
