# Web App

This workspace contains the Next.js web application for **WC3 Matchup Guide**.

It is the main browser experience for the project and also hosts the backend behavior the app relies on, including authentication flows, server actions, and the web-facing content pages.

## What `/apps/web` does

- Renders the public guide site for Warcraft III players
- Serves detail pages for races, matchups, builds, heroes, units, items, buildings, and maps
- Handles user auth pages such as login and register
- Provides favorites and user-specific actions in the web UI
- Contains the admin area used to manage guide content
- Uses shared data and types from the monorepo packages

## Main areas

- `app/`
  Next.js App Router pages, layouts, route handlers, and server actions
- `components/`
  Reusable UI used across guide pages and admin screens
- `lib/`
  Web-only content helpers, lookups, and data shaping utilities
- `public/`
  Static assets such as images used by the site

## Current web experience

The web app currently includes pages for:

- Home
- Login
- Register
- Favorites
- Races
- Matchups
- Builds
- Heroes
- Units
- Items
- Buildings
- Maps
- Admin

## Commands

From the repo root:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

From this workspace directly:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```
