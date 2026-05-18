# Release Checklist

Use this before deploying WC3 Matchup Guide to Neon/Vercel.

Reference setup guide:

- [DEPLOYMENT.md](/home/thinkpadl14/Projects/wc3-matchup-guide/docs/DEPLOYMENT.md)

## 1. Local validation

- Run `npm install`
- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run build`
- Run `npm run test`
- Run `npm run mobile:typecheck`
- Run `npm run mobile:export`
- Run `npm run deploy:check`
- Run `npm run deploy:smoke`
- Confirm GitHub Actions CI is passing

## 2. Environment readiness

Required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `EXPO_PUBLIC_API_URL`
- `SMOKE_BASE_URL`
- `SMOKE_API_URL`

Checks:

- `DATABASE_URL` points to the intended Neon database
- `JWT_SECRET` is long, random, and production-only
- `NEXT_PUBLIC_API_URL` points to the deployed web domain `/api`
- `NEXT_PUBLIC_APP_URL` points to the deployed web domain root
- `EXPO_PUBLIC_API_URL` points to the deployed web domain `/api`
- `SMOKE_BASE_URL` points to the deployed web domain root
- `SMOKE_API_URL` points to the deployed web domain `/api` if you override it

## 3. Database readiness

- Confirm Neon database exists
- Run `npm run db:migrate`
- Run `npm run db:seed`
- Verify demo users exist only for demo/staging usage

## 4. Web deployment readiness

- If using Vercel for the web app, confirm the repo config in `vercel.json`
- Confirm Vercel project env vars are set
- Confirm build command is `npm run build`
- Confirm install command is `npm install`
- Confirm the correct branch is deployed

## 5. Expo web export readiness

- Run `npm run mobile:export`
- Confirm the export completed into `apps/mobile/dist`
- Confirm `apps/mobile/dist/_redirects`, `_headers`, and `404.html` were generated
- Confirm `EXPO_PUBLIC_API_URL` is set for the export environment
- If using Vercel or Netlify for the Expo web build, confirm the repo config in `apps/mobile/vercel.json` or `apps/mobile/netlify.toml` matches the chosen host
- Deploy the exported bundle to the chosen static host
- Confirm the mobile web build points at the deployed REST API

## 6. Post-deploy checks

- Open `/api/health`
- Confirm `status` is `ok`
- Confirm `readiness.databaseConfigured` is `true`
- Confirm `readiness.databaseReachable` is `true`
- Confirm `readiness.authConfigured` is `true`
- Run `npm run deploy:smoke`
- Use [SMOKE_TESTS.md](/home/thinkpadl14/Projects/wc3-matchup-guide/docs/SMOKE_TESTS.md) for any additional manual checks

## 7. Final capstone submission checks

- Web deployment URL is working
- Expo web export URL is working
- Neon-backed data is live
- Auth flow works
- Favorites flow works
- Admin CRUD works across races, heroes, units, maps, builds, and matchups
- README is up to date
- Screenshots are captured if needed for submission
- [SUBMISSION_TEMPLATE.md](/home/thinkpadl14/Projects/wc3-matchup-guide/docs/SUBMISSION_TEMPLATE.md) is filled out with final URLs and verification notes
