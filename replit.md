# Brielo Replit Project

Brielo is a mobile-first social lifestyle prototype built in Replit.

The current app prototype lives in:

artifacts/rally

Note: the folder name still says rally because Rally was an earlier codename. Do not rename this folder yet.

## Current Brand

* App name: Brielo
* Tagline: Live More
* Core action: Make a Move
* Supporting line: Find people to do things with — once, weekly, or whenever you're down.

## Product Summary

Brielo helps people make real-life Moves, meet people through activities, and add good people to their Circle.

## Current Prototype Status

* Front-end clickable prototype
* React/Tailwind-style app
* localStorage/mock data
* No production backend
* No real authentication
* No payments
* No WebSockets
* No push notifications
* No livestreaming

## Agent Instructions

Before making changes, read:

* docs/06_AGENT_HANDOFF.md
* docs/05_DECISION_LOG.md
* docs/02_PRODUCT_SPEC.md

Do not reintroduce old Rally, Brio, Plan, or Crew language.

After making changes:

* Do not change app functionality.
* Do not run broad refactors.
* Do not rename folders.
* Summarize the files created or updated.
* Confirm that the prototype behavior was not intentionally changed.

## Run & Operate

* `pnpm --filter @workspace/api-server run dev` — run the API server (serves the built Brielo frontend)
* `pnpm --filter @workspace/rally run build` — build the Brielo frontend prototype
* The api-server workflow auto-restarts the server on unexpected exit (see artifacts/api-server/supervise.mjs)

## User preferences

* App is served via the Express api-server workflow, not a dev server. "Reset api" means restart the `artifacts/api-server: API Server` workflow only — never restart `artifacts/rally: web`.
* Keep documentation accurate to the current Brielo direction; do not reintroduce Rally/Brio/Plan/Crew language.

## Pointers

* See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
