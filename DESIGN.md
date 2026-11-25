# Airdrop Tracker — Design Doc (personal)

## Intent & why
Personal dashboard to track crypto airdrops the user participates in.
Data stays on-device (localStorage) — private, offline-capable. Arabic UI.

## Goals
- Add / edit / delete airdrop entries quickly
- See status at a glance + summary stats (total, pending, confirmed rewards)
- Backup via export/import JSON

## Non-goals (v1)
- No multi-user, no auth, no server deployment
- No automatic on-chain verification (phase 2: optional Binance wallet read-only integration via installed `baw` CLI / binance skills)

## Data model (per airdrop)
name, projectUrl, chain, walletAddress, tasks[] (done?), expectedReward, receivedReward, status (pending|confirmed|claimed|expired), dateAdded, notes

## Approaches considered
1. Single static HTML page + localStorage — simplest, offline; user chose React instead
2. Local server (Python + JSON file) — more structure than needed for personal use
3. **React + Vite SPA (chosen)** — component structure, easy to extend; still local-only data

## Stack
React 18 + Vite, hand-written CSS (dark dashboard theme, per design-taste-frontend:
one clear system, no slop). No UI library. Persistence: localStorage + JSON export/import.

## Structure
- `src/App.jsx` — layout + stats header
- `src/components/AirdropCard.jsx`, `AirdropForm.jsx`, `StatsBar.jsx`, `FilterBar.jsx`
- `src/storage.js` — localStorage load/save + export/import
- Preview in-app via minis://workspace/airdrop-tracker/dist (after `vite build`) or dev server

## Open calls made by builder (user can override)
- Arabic RTL UI, dark theme
- Fields as listed above (user answered "yes" to defaults)
- v1 = local only; Binance integration later if wanted
