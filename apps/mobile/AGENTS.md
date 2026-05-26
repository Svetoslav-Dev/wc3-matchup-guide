# AGENTS.md — Mobile App Brief

## Project

Build the **mobile version** of **WC3 Matchup Guide**.

This app should be a focused Expo client for Warcraft III players who want to browse guide content on phones and tablets. It should not try to replicate the full admin or backend surface from the web app.

## Goal

Create a clean mobile browsing experience for the main guide content:

- races
- matchups
- builds
- heroes
- units
- items
- buildings
- maps
- favorites
- profile

The mobile app should feel fast, readable, and practical. Prioritize navigation, content clarity, and mobile-friendly layouts over complex workflows.

## Tech And Structure

Use:

- Expo
- React Native
- TypeScript
- `expo-router` for file-based routing

Current workspace structure:

- `app/`
  File-based screens and route layout
- `components/`
  Shared mobile UI components
- `lib/`
  Mobile helpers and app-specific utilities

## What The Mobile App Should Include

Implement screens for:

- Home
- Races list
- Race detail
- Matchups list
- Matchup detail
- Builds list
- Build detail
- Heroes list
- Hero detail
- Units list
- Unit detail
- Items list
- Item detail
- Buildings list
- Building detail
- Maps list
- Map detail
- Favorites
- Profile

## Product Boundaries

The mobile app is for **consuming guide content**, not for full content management.

Do:

- let users browse and open guide pages
- support favorites viewing
- keep the app easy to navigate on mobile
- reuse shared monorepo data and types where possible

Do not:

- turn this workspace into the primary admin app
- duplicate web-only admin flows
- add unnecessary backend logic directly in the mobile workspace

## UX Direction

The app should:

- feel like a Warcraft III strategy companion
- be optimized for vertical scrolling and touch navigation
- use clear sectioning and strong readability
- avoid cramped dense desktop-style layouts

## Routing Notes

Use `expo-router` conventions and preserve file-based routing under `app/`.

Current implemented route coverage already includes the screens listed above, so future work should extend or refine that structure rather than replacing it without reason.

## Commands

From the repo root:

```bash
npm run mobile:dev
npm run mobile:web
npm run mobile:typecheck
npm run mobile:export
```
