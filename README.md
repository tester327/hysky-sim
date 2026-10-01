# HySky Sim

A Hypixel Skyblock-inspired clicker game, rebuilt as a static, client-only single-page app. This is a
from-scratch TypeScript/React rewrite of `legacy/hysky simulator v 1.5(GEMSTONES).py`, a Tkinter prototype -
see `CLAUDE.md` for the full history and `BALANCING.md` for every numeric change from the original.

## Stack

- TypeScript (strict) + React 19 + Vite
- [Zustand](https://github.com/pmndrs/zustand) for state management
- React Router for client-side navigation
- No backend: all game state lives in the browser (`localStorage`), no server, no accounts

Game logic (`src/game/**`) is plain TypeScript with no React dependency - all numeric values (costs, yields,
XP curves, drop tables) live in `src/game/data/*.ts`, so rebalancing never requires touching UI code.

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run typecheck # type-check without emitting
npm run build      # production build into dist/
npm run preview    # locally preview the production build
```

## Saves

Progress autosaves to the browser's `localStorage` (versioned via `saveVersion` in the save data, so future
updates can migrate old saves - see `src/game/save/migrate.ts`). There is no offline/idle progress; the game
only advances while you are actively clicking. The Settings page lets you export your save as a `.json` file,
import one back in, or reset your progress (with a confirmation prompt).

## Deploying to Netlify

`netlify.toml` is already set up:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The redirect is required because this is a client-routed SPA (React Router) - without it, reloading on a
sub-page like `/mining` would 404 on Netlify. The build uses a relative base path (`base: './'` in
`vite.config.ts`), so it works from any subdomain/subpath without hardcoding a URL.

To deploy: push this repo to GitHub and connect it in Netlify (build command `npm run build`, publish
directory `dist` - already picked up automatically from `netlify.toml`). Point your subdomain's DNS at
Netlify as usual; no app-side configuration is needed for that part.

## Project structure

```
src/game/      game logic: data/config, state types, pure systems, save/load - no React
src/state/     Zustand store wiring the game systems to the UI
src/ui/        React components and pages
legacy/        the original Tkinter prototype (not part of the build, gitignored)
```
