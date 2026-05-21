# WC3 Matchup Guide

WC3 Matchup Guide is a production-style Warcraft III strategy database built as a capstone project. It includes a Next.js web app, a PostgreSQL/Neon backend with Drizzle ORM, JWT authentication, favorites, user-submitted builds, admin content management, and an Expo mobile client backed by the same content API.

## Demo accounts

For quick testing after the database is migrated and seeded:

- Admin: `admin@example.com` / `demo123`
- User: `user@example.com` / `demo123`

## Disclaimer

This project was built as a capstone submission for the "Full Stack Apps with AI" course. It is a fan-made educational project and is not affiliated with or endorsed by Blizzard Entertainment. Warcraft III and all related names, characters, and assets are the intellectual property of Blizzard Entertainment. No ownership of those rights is claimed.

## Image credits

Hero portraits, unit icons, and map previews are sourced from [Warcraft Wiki](https://warcraft.wiki.gg/wiki/) — the community wiki for Warcraft lore and game assets.

Most game art is served from `apps/web/public/images`. The database also supports `imageUrl` fields for races, heroes, units, and maps when hosted assets are preferred.

## Tech stack

| Layer | Technology |
|---|---|
| Web framework | Next.js 15 (App Router) |
| Web UI | React 19, TypeScript, Tailwind CSS v4 |
| Mobile app | Expo SDK 53, React Native, TypeScript, expo-router |
| Database | PostgreSQL via Neon |
| ORM | Drizzle ORM + Drizzle migrations |
| Auth | JWT (cookie-based), bcrypt password hashing |
| Validation | Zod |
| Monorepo | Node.js workspaces |
| CI | GitHub Actions |
| Deployment | Vercel (web), Neon (database) |

## Features

### Web app

**Content pages**
- Home page with featured races, worst/best matchup cards per race, and top builds by race
- Races, heroes, units, buildings, items, maps, matchups, and builds listing pages
- Race detail, hero detail, unit detail, and map detail pages
- Hero detail pages with best items and spell breakdowns
- Unit pages grouped by race category, with heroes shown beneath each race roster
- Map detail pages with creep notes, expansion notes, shop types, and item icons/source labels
- Matchup listing with race filters and difficulty/perspective cards
- Build orders listing with AJAX load-more pagination, per-page selector (20 / 50 / 100), title search, and race images
- Build detail with step-by-step supply/timing instructions and save/remove favorite

**Auth and user features**
- Login and register modal with a full-page blur/dim overlay
- Signed-in username dropdown with favorites, submitted builds, build submission, and logout actions
- Protected favorites page synced with `/api/me/favorites`
- User build submission flow at `/builds/submit`
- Submitted builds list with per-user deletion for owned builds

**Admin**
- Admin mutation APIs for races, heroes, units, maps, builds, and matchups
- Admin dashboard with create, edit, and delete flows across races, heroes, units, maps, builds, and matchups
- Admin reference management pages for buildings and items

**Infrastructure**
- Drizzle schema with `imageUrl` on races, heroes, units, and maps
- Automatic database migration on every Vercel deploy (`db:migrate` runs before `build`)
- Seed script with demo users, Warcraft reference content, and 10,000 generated build records

### Mobile app (Expo)

- Home, races, units, maps, matchups, builds, heroes, favorites, and profile screens
- Home page mirrors web: worst/best matchup sections and build route previews
- Units screen: searchable list with race filter chips (Human, Orc, Undead, Night Elf, Neutral)
- Unit detail: tier, cost (food/gold/lumber), strengths, and weaknesses
- Maps screen: searchable map list
- Map detail: creep notes, expansion notes, available items list, and shop context
- Hero detail: role, primary attribute, highlights, best items, and spells with Ultimate badge
- Build detail with step-by-step instructions and favorites toggle
- Dropdown navigation menu covering all nine sections
- API-first with shared-package fallback for offline / no-config usage
- Auth flow with AsyncStorage token persistence

## Project structure

```txt
wc3-matchup-guide/
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
  Next.js App Router web app, public pages, REST API routes, auth flows, user build submission, and admin editors
- `packages/db`
  Drizzle schema, generated migrations, database client, content queries, buildings/items CRUD helpers, and seed script
- `packages/shared`
  Shared domain types, seeded reference content, and mock fallback content

## Database schema overview

```mermaid
erDiagram
  users ||--o{ builds : creates
  users ||--o{ favorites : saves
  races ||--o{ heroes : has
  races ||--o{ units : has
  races ||--o{ builds : has
  races ||--o{ matchups : as_race_a
  races ||--o{ matchups : as_race_b
  matchups ||--o{ builds : contains
  builds ||--o{ build_steps : has
  builds ||--o{ favorites : saved_in
  users {
    int id
    varchar email
    varchar username
    enum role
  }
  races {
    int id
    varchar slug
    varchar name
    varchar image_url
  }
  heroes {
    int id
    int race_id
    varchar slug
    varchar name
    varchar image_url
  }
  units {
    int id
    int race_id
    varchar slug
    varchar unit_type
    varchar image_url
  }
  maps {
    int id
    varchar slug
    varchar name
    varchar image_url
  }
  matchups {
    int id
    int race_a_id
    int race_b_id
    varchar slug
    varchar difficulty
  }
  builds {
    int id
    int race_id
    int matchup_id
    int created_by_user_id
    varchar slug
    varchar strategy_type
    bool is_published
  }
  build_steps {
    int id
    int build_id
    int step_number
  }
  favorites {
    int id
    int user_id
    int build_id
  }
  buildings {
    int id
    varchar race
    varchar name
    varchar image_file
  }
  game_items {
    int id
    varchar category
    varchar name
    varchar image_file
  }
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

Expected runtime:

- Node.js `20.x`
- `.nvmrc` is included for local version alignment

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

8. Optional: preview the Expo app on the web

```bash
npm run mobile:web
```

9. Open the web app at `http://localhost:3000` unless your local env points it to another port

## Demo credentials

- Admin: `admin@example.com` / `demo123`
- User: `user@example.com` / `demo123`

These only work after the database is migrated and seeded.

## Validation commands

```bash
npm run typecheck
npm run lint
npm run build
npm run test
npm run mobile:typecheck
npm run mobile:export
npm run deploy:check
npm run deploy:smoke
```

`npm run deploy:check` verifies required web and Expo env vars and attempts a real database connection when `DATABASE_URL` is set.
`npm run deploy:smoke` runs a deployed end-to-end smoke test using `SMOKE_BASE_URL` and the demo admin credentials.

## Live deployment

- Web app: `https://wc3-matchup-guide-web.vercel.app`
- Web API health: `https://wc3-matchup-guide-web.vercel.app/api/health`
- GitHub repository: `https://github.com/CookieTheDestroyerOfWorlds/wc3-matchup-guide`

Current production verification status:

- Neon-backed database connection is live
- Auth readiness is live
- `npm run deploy:smoke` passed against the deployed web app
- Expo web export builds successfully from `apps/mobile/dist`

Continuous validation:

- GitHub Actions runs `test`, `lint`, `build`, `typecheck`, `mobile:typecheck`, and `mobile:export` on pushes and pull requests through [.github/workflows/ci.yml](.github/workflows/ci.yml)

Operational docs:

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Smoke Tests](docs/SMOKE_TESTS.md)
- [Submission Template](docs/SUBMISSION_TEMPLATE.md)

## Deployment notes

### Web app

Recommended target: Vercel

- Framework preset: `Next.js`
- Root directory: repo root or `apps/web` depending on your Vercel setup preference
- Repo host config:
  - [vercel.json](vercel.json)
- Build command:

```bash
npm run db:migrate && npm run build
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

### Expo web export

Recommended target: static hosting on Vercel, Netlify, or similar

- Export command:

```bash
npm run mobile:export
```

- Export output:

```txt
apps/mobile/dist
```

- Required public env:
  - `EXPO_PUBLIC_API_URL`
- Export helper files generated automatically:
  - `_redirects` for static host deep-link fallback
  - `_headers` for Expo asset caching
  - `404.html` for static not-found handling
- Repo host configs:
  - web app: [vercel.json](vercel.json)
  - [apps/mobile/vercel.json](apps/mobile/vercel.json)
  - [apps/mobile/netlify.toml](apps/mobile/netlify.toml)

## Final submission record

Fill these in after deployment:

- Web app URL: `https://...`
- Expo web URL: `https://...`
- GitHub repo URL: `https://github.com/...`

Before submission:

- run `npm run deploy:check`
- run `npm run deploy:smoke`
- confirm `/api/health` reports healthy readiness flags
- capture screenshots for the main web and Expo flows
- copy final URLs into [docs/SUBMISSION_TEMPLATE.md](docs/SUBMISSION_TEMPLATE.md)

## Important routes

Public APIs:

- `GET /api/health`
- `GET /api/races`
- `GET /api/races/:slug`
- `GET /api/heroes`
- `GET /api/heroes/:slug`
- `GET /api/units`
- `GET /api/units/:slug`
- `GET /api/maps`
- `GET /api/maps/:slug`
- `GET /api/matchups`
- `GET /api/matchups/:slug`
- `GET /api/builds`
- `GET /api/builds/:slug`

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

- `POST /api/admin/races`
- `PUT /api/admin/races/:id`
- `DELETE /api/admin/races/:id`
- `POST /api/admin/heroes`
- `PUT /api/admin/heroes/:id`
- `DELETE /api/admin/heroes/:id`
- `POST /api/admin/units`
- `PUT /api/admin/units/:id`
- `DELETE /api/admin/units/:id`
- `POST /api/admin/maps`
- `PUT /api/admin/maps/:id`
- `DELETE /api/admin/maps/:id`
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
- one additional local admin seed user
- four playable races plus the neutral content race
- heroes
- units
- maps
- matchups
- buildings
- game items
- base build orders and steps
- favorites
- 10,000 generated build rows for pagination and performance testing
