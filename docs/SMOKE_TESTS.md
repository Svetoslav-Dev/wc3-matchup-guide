# Smoke Tests

Run these after the app is deployed and the database is migrated and seeded.

## Public browsing

1. Open home page
2. Open races list and one race detail page
3. Open heroes list and one hero detail page
4. Open matchups list and one matchup detail page
5. Open builds list and one build detail page
6. Use build filters and confirm results change

Expected:

- Pages render without server errors
- List/detail pages return real data
- No broken links in the primary flows

## Health and readiness

1. Open `/api/health`

Expected:

- Response is JSON
- `status` is `ok`
- `databaseConfigured` is `true`
- `databaseReachable` is `true`
- `authConfigured` is `true`

## Auth

1. Open `/register`
2. Create a new user account
3. Confirm session appears in the header
4. Log out
5. Open `/login`
6. Log in as the created user

Expected:

- Registration succeeds
- Login succeeds
- Logout succeeds
- Header reflects session state correctly

## Favorites

1. Log in as a regular user
2. Open a build detail page
3. Save the build to favorites
4. Open `/favorites`
5. Confirm the build appears
6. Remove the build from the build detail page or delete it through the protected flow
7. Confirm it disappears from `/favorites`

Expected:

- Protected favorites endpoints work
- Favorites are tied to the signed-in user

## Admin

1. Log in as `admin@example.com`
2. Open `/admin`
3. Open build creation form
4. Create a new build
5. Edit the same build
6. Delete the build from the admin dashboard
7. Open matchup creation form
8. Create a new matchup
9. Edit the matchup
10. Delete the matchup from the admin dashboard

Expected:

- Admin dashboard loads
- Non-admin restrictions are bypassed only for admin
- Create, edit, and delete flows persist correctly

## Permission checks

1. Log in as a regular user
2. Open `/admin`
3. Try protected admin APIs if needed

Expected:

- Admin page denies access
- Admin APIs return `403` or `401`

## Failure cases worth checking

1. Try login with wrong password
2. Try registering an existing email
3. Try opening `/favorites` while signed out
4. Try opening admin pages while signed out

Expected:

- Errors are surfaced cleanly
- Protected flows do not silently succeed

