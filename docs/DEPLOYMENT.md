# Deployment Guide

This guide covers the intended production setup for Warcraft 3 Strategy Hub.

## Architecture

- Web app: Vercel
- Database: Neon PostgreSQL
- Expo web export: Vercel or Netlify static hosting

## Runtime

Use Node.js `20.x` for:

- local development
- GitHub Actions
- Vercel
- Netlify

Repo hints:

- [.nvmrc](/home/thinkpadl14/Projects/warcraft3-guide-hub/.nvmrc)
- `package.json` `engines.node`

## 1. Neon

Create a Neon project and copy the production connection string.

Set:

- `DATABASE_URL=postgresql://...`

Then run:

```bash
npm run db:migrate
npm run db:seed
```

## 2. Web app on Vercel

Use the repo root as the project root.

Repo config:

- [vercel.json](/home/thinkpadl14/Projects/warcraft3-guide-hub/vercel.json)

Expected commands:

- install: `npm install`
- build: `npm run build`

Required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `EXPO_PUBLIC_API_URL`

Recommended values:

- `NEXT_PUBLIC_API_URL=https://your-web-domain/api`
- `NEXT_PUBLIC_APP_URL=https://your-web-domain`
- `EXPO_PUBLIC_API_URL=https://your-web-domain/api`

After deploy, verify:

- `https://your-web-domain/api/health`
- `readiness.databaseConfigured === true`
- `readiness.databaseReachable === true`
- `readiness.authConfigured === true`

## 3. Expo web export

Generate the static build:

```bash
npm run mobile:export
```

Output:

- `apps/mobile/dist`

Generated helper files:

- `_redirects`
- `_headers`
- `404.html`

### Option A: Vercel

Use the mobile-specific config:

- [apps/mobile/vercel.json](/home/thinkpadl14/Projects/warcraft3-guide-hub/apps/mobile/vercel.json)

Expected commands:

- install: `npm install`
- build: `npm run mobile:export`
- output: `apps/mobile/dist`

### Option B: Netlify

Use:

- [apps/mobile/netlify.toml](/home/thinkpadl14/Projects/warcraft3-guide-hub/apps/mobile/netlify.toml)

Expected commands:

- build: `npm run mobile:export`
- publish: `apps/mobile/dist`

## 4. Production verification

Before final submission:

```bash
npm run deploy:check
```

Then point the smoke test at production:

```bash
SMOKE_BASE_URL=https://your-web-domain npm run deploy:smoke
```

Optional explicit API override:

```bash
SMOKE_BASE_URL=https://your-web-domain \
SMOKE_API_URL=https://your-web-domain/api \
npm run deploy:smoke
```

## 5. Final handoff

After deployment:

- fill in [SUBMISSION_TEMPLATE.md](/home/thinkpadl14/Projects/warcraft3-guide-hub/docs/SUBMISSION_TEMPLATE.md)
- capture screenshots
- add live URLs to `README.md`
