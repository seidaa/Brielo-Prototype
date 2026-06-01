---
name: api-server resilience / supervisor
description: Why the api-server has a supervise.mjs wrapper and the rules its restart logic must follow
---

# api-server crash-on-idle fix

The `api-server` artifact serves the built `rally` frontend (Express on port 8080). It was repeatedly dying on idle and never recovering, forcing the user to manually "Reset api".

## Root cause
The workflow `dev` script chained `pnpm run build && pnpm run start`. When the inner `node` received SIGTERM (idle-kill), pnpm's recursive runner surfaced it as `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` — a *failure* — and nothing brought the server back.

## Fix shape
`dev` now does `build && node ./supervise.mjs`. `supervise.mjs` spawns the built server, restarts it on unexpected exit, and owns shutdown.

## Rules the supervisor must obey (learned the hard way)
- **The supervisor is the SOLE authority on shutdown.** Any child exit while `shuttingDown` is false is unexpected → restart it, regardless of exit code.
- **Do NOT special-case child exit code 0 as "clean, don't restart."** `src/index.ts` has a graceful SIGTERM handler that makes the child exit 0 — so an external SIGTERM (the exact idle-kill we're fixing) produces code 0. Treating code 0 as intentional defeats the whole self-heal. This was a real regression caught in review+test.
- **Crash-loop protection is what prevents masking boot failures:** cap restarts (e.g. >5 within 30s → `process.exit(1)` so the workflow marks failed). A missing/invalid `PORT` exits fast and repeatedly, hitting the cap instead of looping forever.
- **Shutdown must escalate:** on SIGTERM/SIGINT, send the child SIGTERM, then SIGKILL after a grace window, then exit — don't `exit(0)` while the child may still be running (orphan/port-conflict risk). Child is spawned `detached: true` so it can be killed as a process group via `process.kill(-child.pid, sig)`.

**Why:** these three points each came from a concrete failure — the pnpm wrapper hid the original crash, the code-0 shortcut silently disabled self-heal, and without the cap a boot failure would loop invisibly.

## Operational note
When the user says "Reset api", just `restart_workflow` on `artifacts/api-server: API Server`. NEVER restart `artifacts/rally: web`. Serve flow if rebuilding the frontend: `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/rally run build`, then restart the api-server workflow.
