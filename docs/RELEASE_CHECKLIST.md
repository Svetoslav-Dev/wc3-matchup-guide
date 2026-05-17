# Release Checklist

Use this before deploying Warcraft 3 Strategy Hub to Neon/Vercel.

## 1. Local validation

- Run `npm install`
- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run build`
- Run `npm run deploy:check`

## 2. Environment readiness

Required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

Checks:

- `DATABASE_URL` points to the intended Neon database
- `JWT_SECRET` is long, random, and production-only
- `NEXT_PUBLIC_API_URL` points to the deployed web domain `/api`
- `NEXT_PUBLIC_APP_URL` points to the deployed web domain root

## 3. Database readiness

- Confirm Neon database exists
- Run `npm run db:migrate`
- Run `npm run db:seed`
- Verify demo users exist only for demo/staging usage

## 4. Web deployment readiness

- Confirm Vercel project env vars are set
- Confirm build command is `npm run build`
- Confirm install command is `npm install`
- Confirm the correct branch is deployed

## 5. Post-deploy checks

- Open `/api/health`
- Confirm `status` is `ok`
- Confirm `readiness.databaseConfigured` is `true`
- Confirm `readiness.databaseReachable` is `true`
- Confirm `readiness.authConfigured` is `true`
- Run the smoke test checklist in [SMOKE_TESTS.md](/home/thinkpadl14/Projects/warcraft3-guide-hub/docs/SMOKE_TESTS.md)

## 6. Final capstone submission checks

- Web deployment URL is working
- Neon-backed data is live
- Auth flow works
- Favorites flow works
- Admin build/matchup CRUD works
- README is up to date
- Screenshots are captured if needed for submission

