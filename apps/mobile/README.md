# Mobile App

This workspace contains the Expo mobile client for **WC3 Matchup Guide**.

It focuses on the core player-facing browsing experience and gives mobile users access to the main guide content without the full admin surface that exists in the web app.

## What the mobile app can do

- Browse race guides
- Open race detail pages
- Browse matchup guides
- Open matchup detail pages
- Browse build orders
- Open build detail pages
- Browse hero, unit, item, building, and map reference pages
- View favorites
- Open the profile screen

## Current screen set

- Home
- Races
- Race detail
- Matchups
- Matchup detail
- Builds
- Build detail
- Heroes
- Hero detail
- Units
- Unit detail
- Items
- Item detail
- Buildings
- Building detail
- Maps
- Map detail
- Favorites
- Profile

## Routing

The mobile app uses `expo-router` for file-based navigation under `app/`.

## Commands

From the repo root:

```bash
npm run mobile:dev
npm run mobile:web
npm run mobile:typecheck
npm run mobile:export
```

From this workspace directly:

```bash
npm run dev
npm run web
npm run typecheck
npm run export:web
```
