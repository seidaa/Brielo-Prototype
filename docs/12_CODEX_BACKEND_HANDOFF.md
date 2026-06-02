# Codex Backend Handoff for Brielo

## Read This First

Brielo is currently a front-end prototype.

Do not assume backend implementation has started.

Before making backend changes, read:

- docs/06_AGENT_HANDOFF.md
- docs/05_DECISION_LOG.md
- docs/02_PRODUCT_SPEC.md
- docs/10_BACKEND_PLAN.md
- docs/11_MVP_CHECKLIST.md

## Current Important Constraint

The active app currently lives in:

`artifacts/rally`

This folder name is outdated from an earlier codename, but do not rename it unless explicitly asked.

Internal routes may still use old names like `/rally/:id`.

Do not rename routes or folders during backend planning.

## Product Truths

- Current app name is Brielo.
- Previous names were Rally and Brio.
- User-facing copy should not use Rally or Brio.
- Moves are one-time activities.
- Circle is people-based, not recurring groups.
- Request to Join is not the same as I'm In.
- Ask Host is not the same as Request to Join.
- Leave Move is not the same as Cancel Move.
- Move Chat should only exist for joined/active Moves.
- Show-Up Trust should be fair, not punitive.
- Safety reports should be private.

## Do Not Build Unless Asked

Do not add:

- database
- auth
- API routes
- backend server changes
- WebSockets
- real push notifications
- payments
- subscriptions
- livestreaming
- AI matching
- venue dashboards
- full moderation dashboard
- DMs outside Move Chat

## If Backend Work Is Explicitly Requested Later

Start small.

Recommended first backend phase:

1. Define schema/data model.
2. Add User model.
3. Add Move model.
4. Add MoveAttendee model.
5. Add JoinRequest model.
6. Add MoveChat and ChatMessage models.
7. Add CircleConnection model.
8. Add Notification model.
9. Add SafetyReport model.
10. Add LeaveReason model.
11. Add TrustEvent model.

Do not implement all advanced features in one pass.

## Behavioral Rules To Preserve

### I'm In

Use for normal Moves only.

Should:
- join instantly
- increase going count
- decrease spots left
- unlock Move Chat
- create notification

### Request to Join

Use for host-approval Moves.

Should:
- create pending request
- not increase going count
- not decrease spots left
- not unlock Move Chat
- notify host/requester

### Ask Host

Should:
- send question
- not join Move
- not request approval
- not unlock Move Chat
- not affect spots

### Leave Move

Should:
- remove joined user
- free spot
- remove Move Chat access
- not count as no-show
- optionally store leave reason

### Cancel Move

Should:
- be host-only
- close Move
- remove active surfaces
- close chat
- not be treated like Leave Move

### Circle

Should:
- connect people
- not create recurring groups
- use "Met through [Move Name]" language where applicable

### Show-Up Trust

Should:
- use Show-Up Rate as metric
- use Recently Missed Moves as warning label
- avoid public shaming
- allow recovery over time

### Safety

Pre-Move:
- "Something feels off"
- softer safety note
- private review

Post-Move:
- formal report
- private/moderation-facing

## Backend Implementation Principles

When backend begins:

- Build one vertical slice at a time.
- Preserve current prototype behavior.
- Do not break localStorage prototype until migration plan exists.
- Add tests or clear QA notes when possible.
- Avoid broad refactors.
- Avoid changing user-facing language unless requested.
- Keep product language aligned with docs.

## Suggested First Real Backend Slice

First backend slice should probably be:

User + Move + MoveAttendee

It should support:
- create Move
- fetch active Moves
- join normal Move
- leave Move
- cancel hosted Move

Do not start with:
- livestreaming
- payments
- AI matching
- advanced trust scoring
- full moderation dashboard

## Final Warning

Codex should not invent new product concepts.

Use Brielo's existing language system:
- Moves
- Make a Move
- Make It Live
- I'm In
- Request to Join
- Ask Host
- Leave Move
- Cancel Move
- Move Chat
- Circle
- Add to Circle
- Show-Up Trust
- Something feels off

Do not reintroduce:
- Rally
- Brio
- Plans
- Crews
- RSVP
- Flake
- Low Show Rate
- Low Show-Up Rate
- Creepy
- Bad User
- Blacklisted
- Unreliable

Final goal:
Codex should treat this repo as a focused Brielo MVP prototype and should only begin backend work when explicitly instructed.
