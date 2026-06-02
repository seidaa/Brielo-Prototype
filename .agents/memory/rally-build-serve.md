---
name: Rally (Brielo) build & serve flow
description: How the artifacts/rally web app is built and served; why its workflow shows "failed"
---

# Rally / Brielo build & serve

The `artifacts/rally` app (product name "Brielo", folder must NOT be renamed) is served as a **static production build by the api-server**, not by its own dev workflow.

**Why:** The `artifacts/rally: web` workflow shows status "failed" by design — this is EXPECTED/normal, not a bug. The live preview comes from the api-server serving `artifacts/rally/dist/public`.

**How to apply (after editing rally source):**
1. `pnpm --filter @workspace/rally exec tsc --noEmit`
2. `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/rally run build`
3. `restart_workflow("artifacts/api-server: API Server")`

Never rely on restarting `artifacts/rally: web` to see changes.
