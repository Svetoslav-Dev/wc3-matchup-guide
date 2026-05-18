# Database Package

This package owns the PostgreSQL schema, Drizzle configuration targets, and seed logic for WC3 Matchup Guide.

## Included

- Full schema for users, races, heroes, units, maps, matchups, builds, build steps, and favorites
- Indexed columns for list filtering and favorites lookup
- Seed script with demo users and 10,000 generated build records

## Commands

Run from the repo root:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```
