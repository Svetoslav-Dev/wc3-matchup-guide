# AGENTS.md — Web App Brief

## Project

Build the **web version** of **WC3 Matchup Guide**.

This should be the main browser experience for the project and the primary surface for guide browsing, auth flows, favorites, content submission, admin pages, and web-facing server behavior.

## Goal

Create a production-style Warcraft III guide site that lets users:

- browse races
- browse matchups
- browse builds
- browse heroes
- browse units
- browse items
- browse buildings
- browse maps
- register and log in
- manage favorites
- submit builds

Admins should also have dedicated pages for managing the main content areas.

## Tech And Structure

Use:

- Next.js App Router
- React
- TypeScript
- shared monorepo packages for data and types

Current workspace structure:

- `app/`
  Routes, layouts, server-rendered pages, and server actions
- `components/`
  Reusable web UI
- `lib/`
  Web helpers, lookups, and content shaping logic
- `public/`
  Static assets

## What The Web App Should Include

Public user-facing pages:

- Home
- Login
- Register
- Favorites
- Races list and detail
- Matchups list and detail
- Builds list and detail
- Build submission and user build pages
- Heroes list and detail
- Units list and detail
- Items list and detail
- Buildings list and detail
- Maps list and detail

Admin pages:

- Admin dashboard
- Admin races
- Admin heroes
- Admin units
- Admin items
- Admin buildings
- Admin maps
- Admin matchups
- Admin builds

API routes currently supported:

- `GET /api/health`
- `GET /api/races`
- `GET /api/heroes`
- `GET /api/units`
- `GET /api/maps`
- `GET /api/matchups`
- `GET /api/builds`

## Product Boundaries

This is the main app for richer workflows.

Do:

- keep public guide browsing polished and fast
- support auth-related flows
- keep favorites working in the web UI
- preserve admin content management pages
- keep server-driven patterns where they already exist

Do not:

- move admin responsibility into the mobile app
- duplicate shared data models unnecessarily
- replace App Router patterns without a strong reason

## UX Direction

The site should feel like a Warcraft III strategy database:

- content-first
- easy to scan
- strong hierarchy
- practical rather than decorative

Keep the experience readable across desktop and smaller screens.

## Architecture Notes

The web app already implements:

- public guide browsing across major content areas
- authentication screens and actions
- favorites behavior
- build submission and user build pages
- admin sections for content management
- read-only API endpoints for app consumers

Future work should build on this structure rather than redefining the app from scratch.

## Commands

From the repo root:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```
