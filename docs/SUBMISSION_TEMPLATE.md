# Submission Template

Use this after the live deployment is complete.

## Deployment links

- Web app:
  - `https://wc3-matchup-guide-web.vercel.app`
- Expo web export:
  - `pending`
- GitHub repository:
  - `https://github.com/CookieTheDestroyerOfWorlds/wc3-matchup-guide`

## Production verification

- `npm run deploy:check` passed against production config
- `npm run deploy:smoke` passed against the deployed app
- `/api/health` returned:
  - `status: ok`
  - `readiness.databaseConfigured: true`
  - `readiness.databaseReachable: true`
  - `readiness.authConfigured: true`

## Demo accounts

- Admin:
  - `admin@example.com`
  - `demo123`
- User:
  - `user@example.com`
  - `demo123`

## Suggested screenshots

- Home page
- Build list with filters
- Build detail page
- Favorites page while signed in
- Admin dashboard
- Admin create/edit screen
- Expo web home screen
- Expo web builds or favorites screen

## Final notes

- Mention any known limitations briefly
- Confirm Neon is the active production database
- Confirm both web and Expo web builds point at the same deployed API once the Expo export is published
