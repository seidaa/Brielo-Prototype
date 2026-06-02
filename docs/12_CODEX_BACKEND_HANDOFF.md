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

The first backend slice should be:

User + Move + MoveAttendee only.

Phase 1 should support only:

- user identity placeholder or basic user shell
- Move table/model
- MoveAttendee table/model
- create Move
- fetch/list active Moves
- join normal Move
- leave Move
- cancel hosted Move

The following are explicitly out of Phase 1:

- Request to Join
- Ask Host
- Move Chat persistence
- Circle connections
- Show-Up Trust scoring
- Notifications
- Safety reports
- Leave reasons
- Post-Move feedback
- moderation workflows

> Warning: Do not build chat, Circle, trust, notifications, or safety until the database-backed Move lifecycle is working.

Do not implement all advanced features in one pass.

## Phase 1 Implementation Scope

The full data model list in docs/10_BACKEND_PLAN.md is future planning, not Phase 1 implementation scope. Phase 1 implements only User, Move, and MoveAttendee, with the reduced fields and enums below.

### Phase 1 handles normal Moves only

- Phase 1 backend handles normal (instant-join) Moves only.
- Host-approval Moves, Request to Join, and Ask Host stay out of backend Phase 1.
- They remain prototype/localStorage behavior until Phase 2.

### Phase 1 behavior overrides

- In Phase 1, joining a Move should NOT persist Move Chat.
- In Phase 1, joining a Move should NOT create real notifications.
- Move Chat and notifications remain prototype/localStorage behavior until later phases.

### Phase 1 model fields

Phase 1 User should include basic identity/profile fields only. Do not include real auth fields, trust counters, or safety fields in Phase 1.

- id
- displayName
- handle
- avatarUrl
- city
- createdAt
- updatedAt

Phase 1 Move:

- id
- hostUserId
- title
- category
- locationName
- latitude
- longitude
- startTime
- endTime
- status
- maxSpots
- details
- createdAt
- updatedAt
- canceledAt

Phase 1 MoveAttendee:

- id
- moveId
- userId
- status
- joinedAt
- leftAt
- createdAt
- updatedAt

### Phase 1 status enums

Move.status:
- active
- canceled
- completed

MoveAttendee.status:
- joined
- left
- removed

Do not use requested, approved, declined, attended, or noShow in Phase 1.

### Phase 1 maxSpots and host

For Phase 1, maxSpots means attendee spots available to non-host users. The host does not count against maxSpots.

### Phase 1 auth

In Phase 1, a basic user identity shell may act as the current user. Real authentication is out of scope until explicitly requested.

## Revised Backend Phase Order

Phase 0: Planning / Schema Review
- finalize model names
- finalize status enums
- finalize capacity rules
- finalize localStorage migration strategy

Phase 1: Move Lifecycle Foundation
- User
- Move
- MoveAttendee
- create Move
- list active Moves
- join normal Move
- leave Move
- cancel hosted Move

Phase 2: Host Approval + Ask Host
- JoinRequest
- AskHostMessage
- request to join
- approve/decline request
- ask host question

Phase 3: Move Chat + Circle
- MoveChat
- ChatMessage
- CircleConnection
- chat access rules
- add to Circle

Phase 4: Trust + Safety
- PostMoveFeedback
- TrustEvent
- SafetyReport
- LeaveReason
- private review handling

Phase 5: Notifications + Polish
- Notification table
- read states
- notification cleanup
- later real push notification planning

## Capacity Rules

Phase 1 capacity rules:

- attendee count should be derived from MoveAttendee records with status joined
- spots left should be maxSpots minus joined attendee count
- joining must use an atomic capacity check
- prevent duplicate active attendee records for the same user and Move
- users cannot join canceled or completed Moves
- users cannot join full Moves
- canceling a Move should update status instead of deleting it
- leaving a Move should update attendee status instead of deleting it

> Codex warning: Do not let Codex build the entire backend at once. The first backend implementation should only prove the database-backed Move lifecycle.

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
