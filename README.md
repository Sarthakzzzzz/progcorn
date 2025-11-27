# PRHub (Programming Resources Hub)

A production-ready platform to discover, share, upvote, comment on, and organize programming resources.

## Features
- Submit resources with title, URL, description, category, and tags
- Upvote, comment, report, and save resources
- Create collections
- Browse by tags and categories
- Search with filters and sorting
- Admin moderation: delete, view reports, logs

## Tech Stack
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui (optional components)
- Backend: Node.js, Express, PostgreSQL, Prisma, Zod, JWT, bcrypt
- Deployment: Vercel (frontend), Render/Railway (backend), Managed PostgreSQL

## Monorepo Structure
- app/ — Next.js app (App Router)
- src/ — Express server
- prisma/ — Prisma schema and seed
- styles/ — Tailwind globals

## Environment
Copy `.env.example` to `.env` and set values.

## Install & Run Locally
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## API (REST)
Auth
- POST /auth/register { username, email, password }
- POST /auth/login { email, password }
- GET /auth/me (Bearer token)

Resources
- GET /resources?q=&tag=&categoryId=&sort=newest|popular
- GET /resources/:id
- POST /resources (auth) { title, url, description, categoryId, tags: [tagId] }
- PUT /resources/:id (auth)
- DELETE /resources/:id (auth, soft delete)
- POST /resources/:id/upvote (auth)
- DELETE /resources/:id/upvote (auth)
- GET /resources/:id/comments
- POST /resources/:id/comments (auth) { content }
- POST /resources/:id/report (auth) { reason }

Search
- GET /search?query=&tag=&category=&sort=newest|popular

Tags
- GET /tags
- GET /tags/:name

Categories
- GET /categories
- GET /categories/:name

Collections
- GET /collections (auth)
- POST /collections (auth) { name, description? }
- GET /collections/:id (auth)
- POST /collections/:id/add/:resourceId (auth)

Admin
- GET /admin/resources (admin)
- DELETE /admin/resource/:id (admin)
- GET /admin/reports (admin)

## Database Schema
See `prisma/schema.prisma` for tables: users, resources, tags, resource_tags, upvotes, comments, collections, collection_items, categories, reports, admin_actions.

## Search
Default implementation uses Prisma `contains`. Production: enable PostgreSQL `tsvector` + GIN and switch to raw SQL where clauses.

## Deployment
Frontend (Vercel)
- Import repo, set NEXT_PUBLIC_API_BASE_URL to backend URL
- Build: `npm run build` (Next.js)

Backend (Render/Railway)
- Create service from repo
- Env: PORT=4000, DATABASE_URL, DIRECT_URL, JWT_SECRET
- Start command: `tsx src/index.ts` (or `node dist/server.js` if built)
- Run migrations: `npx prisma migrate deploy`
- Seed (optional): `npm run seed`

Database
- Provision managed PostgreSQL, set DATABASE_URL

## Notes
- Add shadcn/ui via `npx shadcn@latest init` if desired
- Rate limiting and advanced RLS can be added
