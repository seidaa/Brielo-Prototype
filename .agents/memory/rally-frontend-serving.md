---
name: Rally frontend build & serving
description: How the Brielo (folder "rally") frontend is built and served, and which workflow to restart after frontend edits.
---

# Brielo frontend build & serving

The Brielo app lives in `artifacts/rally` (folder name is intentionally NOT renamed despite the product being "Brielo"; earlier codenames were Rally then Brio).

It is a static React+Vite build **served by the Express `api-server`**, not by a Vite dev server.

**Rule:** After editing frontend source, you must rebuild then restart the api-server:
1. `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/rally run build`
2. Restart workflow `artifacts/api-server: API Server`.

**Why:** The api-server serves `artifacts/rally/dist`. Editing source alone changes nothing the user sees until a rebuild; the `artifacts/rally: web` workflow is not the live preview path.

**How to apply:** Never restart `artifacts/rally: web` to publish frontend changes — rebuild + restart api-server instead.

## Brand/product language (enforced; see docs/06_AGENT_HANDOFF.md)
- Current name: Brielo. Do NOT reintroduce Rally, Brio, Plan/Plans, or Crew/Crews in user-facing copy.
- Use clean Lucide line icons, not native emoji, for UI icons.
- Internal identifiers are deliberately left on old names: `useRallies`/`addRally`/etc, `/rally/:id` routes, `brio_*` localStorage keys, `BrioLogo` component. These must be preserved — renaming them is out of scope and would break localStorage/routing.
- Category icons render via a per-page `CAT_ICONS` Lucide map (duplicated per page by existing convention). The `emoji` fields in `CAT_CONFIG` and circle mock data are non-rendered fallbacks.
