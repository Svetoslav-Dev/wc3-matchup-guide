# Warcraft 3 Strategy Hub

Warcraft 3 Strategy Hub is a production-style capstone project for a Warcraft III strategy database with a Next.js web app, PostgreSQL/Neon, Drizzle ORM, JWT auth, protected favorites, and admin content management.

## Current status

The web application is now beyond scaffold stage.

- Public browsing pages are implemented
- REST API routes are implemented
- Drizzle schema, generated migration, and seed script are implemented
- JWT cookie auth is implemented
- Protected favorites are implemented
- Admin-only build and matchup CRUD APIs are implemented
- Admin create/edit web forms are implemented

Still missing for full capstone completion:

- Expo mobile app
- deployment to live services
- final production smoke testing
- broader CRUD coverage for the remaining content types

## Features implemented

- Home, race, hero, matchup, and build pages
- Build detail pages with save/remove favorite actions
- Login, register, logout, and current-session lookup
- Protected favorites page and `/api/me/favorites` endpoints
- Admin-only build and matchup mutation APIs
- Admin dashboard with create, edit, and delete flows
- Drizzle schema for users, races, heroes, units, maps, matchups, builds, build steps, and favorites
- Seed script with demo users and 10,000 generated build records

## Project structure

```txt
warcraft3-guide-hub/
├── apps/
│   ├── mobile/
│   └── web/
├── packages/
│   ├── db/
│   ├── shared/
│   └── ui/
├── AGENTS.md
├── README.md
├── drizzle.config.ts
├── package.json
└── tsconfig.base.json
```

## Architecture

- `apps/web`
  Next.js App Router web app, public pages, API routes, auth flows, and admin editors
- `packages/db`
  Drizzle schema, generated migrations, database client, content queries, seed script
- `packages/shared`
  Shared domain types and mock fallback content

## Database schema overview

```mermaid
erDiagram
  users ||--o{ builds : creates
  users ||--o{ favorites : saves
  races ||--o{ heroes : has
  races ||--o{ units : has
  races ||--o{ builds : has
  races ||--o{ matchups : race_a
  races ||--o{ matchups : race_b
  matchups ||--o{ builds : contains
  builds ||--o{ build_steps : has
  builds ||--o{ favorites : saved_in
```

## Environment variables

Copy `.env.example` to `.env.local` for local development.

```txt
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Notes:

- `DATABASE_URL` is required for database-backed features
- `JWT_SECRET` is required for auth, favorites, and admin protection
- `EXPO_PUBLIC_API_URL` is required for the Expo app to use live auth and favorites
- without these, the public web UI still renders but protected features remain unavailable

## Local setup

1. Install dependencies

```bash
npm install
```

2. Create local env

```bash
cp .env.example .env.local
```

3. Generate migration files if you change schema

```bash
npm run db:generate
```

4. Apply migrations to your local or Neon database

```bash
npm run db:migrate
```

5. Seed demo data

```bash
npm run db:seed
```

6. Start the web app

```bash
npm run dev
```

7. Start the Expo app

```bash
npm run mobile:dev
```

8. Open `http://localhost:3000`

## Demo credentials

- Admin: `admin@example.com` / `demo123`
- User: `user@example.com` / `demo123`

These only work after the database is migrated and seeded.

## Validation commands

```bash
npm run typecheck
npm run lint
npm run build
npm run deploy:check
```

`npm run deploy:check` verifies required env vars and attempts a real database connection when `DATABASE_URL` is set.

Operational docs:

- [Release Checklist](/home/thinkpadl14/Projects/warcraft3-guide-hub/docs/RELEASE_CHECKLIST.md)
- [Smoke Tests](/home/thinkpadl14/Projects/warcraft3-guide-hub/docs/SMOKE_TESTS.md)

## Deployment notes

### Web app

Recommended target: Vercel

- Framework preset: `Next.js`
- Root directory: repo root or `apps/web` depending on your Vercel setup preference
- Build command:

```bash
npm run build
```

- Install command:

```bash
npm install
```

Environment variables to set in Vercel:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `EXPO_PUBLIC_API_URL`

Recommended production values:

- `NEXT_PUBLIC_API_URL=https://your-web-domain/api`
- `NEXT_PUBLIC_APP_URL=https://your-web-domain`
- `EXPO_PUBLIC_API_URL=https://your-web-domain/api`

### Database

Recommended target: Neon PostgreSQL

Deployment sequence:

1. Create a Neon project and copy the connection string
2. Set `DATABASE_URL` locally and in Vercel
3. Run migrations against Neon
4. Run the seed script once
5. Verify login, favorites, and admin routes against the live DB
6. Run `npm run deploy:check` before the final smoke test

### Migration commands against Neon

```bash
npm run db:migrate
npm run db:seed
```

## Important routes

Public APIs:

- `GET /api/health`
- `GET /api/races`
- `GET /api/heroes`
- `GET /api/matchups`
- `GET /api/builds`

`GET /api/health` reports service status plus readiness flags for database and auth configuration.

Auth APIs:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Protected user APIs:

- `GET /api/me/favorites`
- `POST /api/me/favorites`
- `DELETE /api/me/favorites/:id`

Admin APIs:

- `POST /api/admin/builds`
- `PUT /api/admin/builds/:id`
- `DELETE /api/admin/builds/:id`
- `POST /api/admin/matchups`
- `PUT /api/admin/matchups/:id`
- `DELETE /api/admin/matchups/:id`

## Seed contents

The seed script creates:

- demo admin user
- demo regular user
- four races
- heroes
- units
- maps
- matchups
- base build orders and steps
- favorites
- 10,000 generated build rows for pagination and performance testing

## Remaining major work

1. Add persistent mobile auth storage instead of session-memory token state
2. Add richer admin listing, filtering, and form feedback
3. Extend CRUD to more content types such as heroes, races, units, and maps
4. Perform live Neon + Vercel deployment and verification
5. Add screenshots and final capstone submission polish
