---
name: Brielo Show-Up Trust
description: Phase 1 flaking-accountability prototype conventions in artifacts/rally
---

# Brielo Show-Up Trust (Phase 1, front-end/localStorage only)

Trust signals for other people live in `brio_people_trust`; the user's own trust
fields live on the user profile (`brio_*`). Pure helpers + label styles are in
`src/lib/trust.ts`; hooks (`usePeopleTrust`, `useUser.setMissNote`) in
`src/hooks/useRallies.ts`.

**Reversible feedback rule:** any UI that toggles feedback (post-move "Didn't
show" / "Would move again" / "Good vibes") must apply *symmetric* +1/-1 deltas to
persisted trust, not add-only.
**Why:** an add-only mutation lets a user toggle a chip on/off and permanently
stack `movesMissed`/counts in localStorage — unfair and incorrect. `recordFeedback`
takes an `apply` boolean; callers pass `isAdding`.
**How to apply:** when wiring any new trust-affecting toggle, revert on untoggle.

**Label/tone rules (firm, fair, human — never shaming):**
- "Show-Up Rate" is a STAT only. NEVER use "Low Show-Up Rate" / "Low Show Rate"
  as a label. No "flake"/"bad user".
- Positive labels: Shows Up, Reliable, Good Vibes, Trusted Host, Would Move Again,
  New / Limited History. Warning labels: Recently Missed Moves, Host Review Recommended.
- A single miss never downgrades the positive trust label; only `computeWarning`
  surfaces a warning once a pattern appears. Curated positive labels in
  `PEOPLE_TRUST` are intentionally NOT recomputed via `computeTrustLabel` (would
  regress e.g. Priya "Trusted Host" → "Reliable").
- Lucide line icons only, no emoji icons.

**Build/serve:** rally is served as a static build by the api-server, NOT its own
dev workflow. After edits: `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/rally run build`
then restart workflow "artifacts/api-server: API Server". Do NOT restart "artifacts/rally: web".
