# Brielo Backend Plan

## Current Status

Brielo is currently a mobile-first front-end prototype built in Replit using React/Tailwind-style UI and localStorage/mock data.

The current prototype includes:

- Onboarding
- Interest selection
- Discover / What's the Move?
- Make a Move
- Move Detail
- I'm In
- Request to Join
- Ask Host
- Move Chat
- Leave Move
- optional Leave Move reason
- hosted Cancel Move
- Live Map
- Profile
- Settings
- Notifications
- Circle / Your Circle
- After the Move?
- Show-Up Trust
- Something feels off
- Safety/reporting flows

There is no real backend yet.

No real:
- authentication
- production database
- API routes
- WebSockets
- push notifications
- payments
- livestreaming
- moderation dashboard

The current prototype should stay localStorage/mock-data based until backend work is explicitly requested.

## Backend Goal

The future backend should support real users, real Moves, real Move participation, host approval, temporary Move Chats, Circle connections, Show-Up Trust, notifications, and private safety/reporting workflows.

The backend should protect Brielo's core loop:

Make a Move → Join or Request to Join → Move Chat → Show up → After the Move → Add to Circle → Trust updates

## Core Data Models

### 1. User

Fields:

- id
- displayName
- handle
- email
- phone
- avatarUrl
- bio
- city
- interests
- createdAt
- updatedAt
- trustStatus
- showUpRate
- movesAttended
- movesMissed
- movesHosted
- goodVibesCount
- wouldMoveAgainCount

Notes:

A user is a mover in the product sense, but user-facing copy should not overuse "mover" unless intentionally chosen.

### 2. Move

Fields:

- id
- hostUserId
- title
- category
- locationName
- latitude
- longitude
- startTime
- endTime
- status: active, completed, canceled
- maxSpots
- details
- vibeTags
- hostApprovalRequired
- createdAt
- updatedAt

Rules:

- Moves are one-time activities.
- Moves are not recurring groups by default.
- Canceled Moves should disappear from active surfaces.
- Completed Moves can appear in Activity History.

### 3. MoveAttendee

Fields:

- id
- moveId
- userId
- status: requested, joined, left, attended, noShow, declined, removed
- joinedAt
- requestedAt
- approvedAt
- declinedAt
- leftAt
- attendedAt
- noShowMarkedAt

Rules:

- For normal Moves, users can join instantly if spots are available.
- For host-approval Moves, users become requested, not joined.
- Requested users should not count as going.
- Requested users should not reduce available spots.
- Requested users should not see Move Chat until approved.
- Leaving before the Move starts is not a no-show.
- Leaving should free the spot.

### 4. JoinRequest

Fields:

- id
- moveId
- requesterUserId
- hostUserId
- status: pending, approved, declined, canceled
- message
- createdAt
- reviewedAt

Rules:

- Request to Join is separate from Ask Host.
- A pending request should not create Move Chat access.
- Approval should create a joined MoveAttendee record.
- Decline should not penalize the requester.

### 5. AskHostMessage

Fields:

- id
- moveId
- senderUserId
- hostUserId
- question
- createdAt
- status: sent, replied, closed

Rules:

- Ask Host is for questions before joining.
- Ask Host should not create a join request.
- Ask Host should not add the user to the Move.
- Ask Host should not reduce available spots.

### 6. MoveChat

Fields:

- id
- moveId
- status: active, closed
- createdAt
- closedAt

Rules:

- Move Chat exists only for the host and joined attendees.
- Pending request users should not see Move Chat.
- Move Chat closes when a Move is canceled.
- Move Chat can become read-only or archived after a Move ends.

### 7. ChatMessage

Fields:

- id
- chatId
- senderUserId
- body
- createdAt
- editedAt
- deletedAt

Rules:

- Chat is for logistics around a specific Move.
- Brielo should not become a general DM app in MVP.
- DMs outside Move Chat are out of scope for MVP v0.1.

### 8. CircleConnection

Fields:

- id
- userId
- connectedUserId
- sourceMoveId
- status: active, removed, blocked
- createdAt
- updatedAt

Rules:

- Circle is people-based.
- Circle is not a recurring group.
- Add to Circle means the user would move with that person again.
- Circle Activity shows updates from people the user has moved with before.

### 9. PostMoveFeedback

Fields:

- id
- moveId
- reviewerUserId
- reviewedUserId
- feedbackTypes
- wouldMoveAgain
- goodVibes
- didntShow
- feltOff
- reportId
- createdAt

Rules:

- Positive feedback can affect Good Vibes and Would Move Again signals.
- Didn't Show can affect Show-Up Trust.
- Felt Off should open a softer safety follow-up.
- Report should open a formal private report flow.
- Negative feedback should not become public reviews.

### 10. TrustEvent

Fields:

- id
- userId
- eventType
- sourceMoveId
- weight
- createdAt
- expiresAt
- notes

Event examples:

- attended_move
- no_show
- left_before_start
- good_vibes_received
- would_move_again_received
- host_canceled_move
- report_submitted
- safety_note_submitted

Rules:

- Show-Up Rate is a metric.
- Recently Missed Moves is the warning label.
- One missed Move should not permanently damage a user.
- Recent behavior matters most.
- Users should be able to recover reputation through consistent attendance.
- Safety/report signals should remain private/moderation-facing.

### 11. Notification

Fields:

- id
- userId
- type
- title
- body
- moveId
- relatedUserId
- readAt
- createdAt

Notification examples:

- Your spot is saved for [Move Name].
- You left [Move Name]. Your spot is open again.
- Your Move is live: [Move Name].
- [Move Name] was canceled. The chat is closed.
- Request sent for [Move Name].
- [Name] requested to join [Move Name].
- Question sent to host for [Move Name].
- Thanks for your feedback on [Move Name].
- Your safety note was sent for review.
- Your report was submitted for review.

### 12. SafetyReport

Fields:

- id
- reporterUserId
- reportedUserId
- moveId
- reportContext: preMove, postMove
- reportType
- details
- status: submitted, inReview, resolved, dismissed
- createdAt
- reviewedAt

Pre-Move safety types:

- move_details_misleading
- location_feels_unsafe
- host_feels_suspicious
- spam_or_scam
- uncomfortable_with_move
- other

Post-Move report types:

- host_didnt_show
- attendee_didnt_show
- made_me_uncomfortable
- harassment
- fake_move
- unsafe_situation
- spam_or_scam
- other

Rules:

- Pre-Move flow should use "Something feels off."
- Post-Move flow can use "Report this Move."
- Reports are private.
- Reports should not be public reviews.
- Reports should not instantly punish users without review.

### 13. LeaveReason

Fields:

- id
- moveId
- userId
- reasonType
- details
- createdAt
- status: submitted, reviewed

Reason types:

- plans_changed
- timing_changed
- location_feels_off
- host_unclear
- felt_uncomfortable
- other

Rules:

- Leave reason is optional.
- Leaving should still work without a reason.
- Leaving before start does not count as no-show.
- Leave reasons are private/moderation-facing.
- Leave reasons do not automatically penalize anyone.

## Core Backend Rules

### Move creation

- Authenticated users can create Moves.
- Moves require title, category, time, location, and max spots.
- Details and vibe tags are optional but recommended.
- Host approval can be toggled on or off.

### Joining a Move

For normal Moves:

- User taps I'm In.
- If spots are available, user becomes joined.
- Going count increases.
- Spots left decreases.
- Move Chat becomes available.
- Notification is created.

For host-approval Moves:

- User taps Request to Join.
- User becomes pending/requested.
- Going count does not increase.
- Spots left does not decrease.
- Move Chat does not become available.
- Host can approve or decline later.

### Leaving a Move

- Joined user can leave before the Move starts.
- Leaving frees the spot.
- Leaving removes Move Chat access.
- Leaving does not count as a no-show.
- Optional leave reason can be stored privately.

### Canceling a hosted Move

- Host can cancel their Move.
- Move status becomes canceled.
- Move is removed from active surfaces.
- Move Chat closes.
- No trust penalty in MVP prototype.
- Future versions may track repeated host cancellations.

### Move Chat

- Only host and joined attendees can access Move Chat.
- Pending users cannot access Move Chat.
- Leaving removes chat access.
- Canceling closes chat.
- Chat is tied to a specific Move.

### Circle

- Circle is people-based.
- Add to Circle happens after moving with someone or after post-Move feedback.
- Circle connections should not create recurring themed groups by default.

### Show-Up Trust

- Show-Up Trust should reward people who show up.
- Repeated missed Moves can lower trust.
- Leaving before start is better than no-showing.
- Recent behavior matters most.
- Trust should be visible but not publicly humiliating.
- Avoid labels like Flake, Bad User, Unreliable, Low Show Rate, Low Show-Up Rate.

### Safety and Reporting

- Pre-Move safety is "Something feels off."
- Post-Move reporting is "Report this Move" or "Report User."
- Reports are private.
- Reports are moderation-facing.
- Negative feedback should not become public review pages.

## MVP Backend Phase 1

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

- attendee count should be derived from MoveAttendee records with status joined/attended
- requested users should not count as going
- requested users should not reduce spots
- joining must check capacity
- prevent duplicate active attendee records for the same user and Move
- users cannot join canceled or completed Moves
- leaving before start does not count as no-show

> Codex warning: Do not let Codex build the entire backend at once. The first backend implementation should only prove the database-backed Move lifecycle.

## Do Not Build Yet

Delay:

- payments
- subscriptions
- livestreaming
- AI matching
- venue dashboards
- creator tools
- full moderation dashboard
- public social feed
- DMs outside Move Chat
- advanced map clustering
- advanced gamification
- app store deployment
- real push notifications

## Suggested Tech Direction

Keep this high-level for now.

Possible future stack directions:

- React front end can stay.
- Backend can later use Node/Express or Replit-compatible API routes.
- Database can later use PostgreSQL, Supabase, or Firebase depending on final direction.
- Real-time chat can later use WebSockets, Supabase Realtime, Firebase, or another realtime system.
- Auth can later use email, phone, or social login.

Do not choose final infrastructure yet.

This document is planning only.

## Migration Notes From localStorage

Current mock keys should eventually map to backend tables:

- brio_moves → Move / MoveAttendee
- brio_user → User
- brio_messages → MoveChat / ChatMessage
- brio_circle_persons → CircleConnection
- brio_people_trust → TrustEvent / User trust fields
- brio_notifications → Notification
- brio_history → ActivityHistory / completed Moves
- brio_join_requests → JoinRequest
- brio_safety_reports → SafetyReport
- brio_leave_reasons → LeaveReason

## Agent Warning

Do not implement backend until explicitly requested.

This document is for planning only.
