# Brielo Decision Log

## Locked Product Decisions

1. App name is Brielo.
2. Pronunciation is BREE-loh.
3. Primary tagline is Live More.
4. Main action phrase is Make a Move.
5. Moves are one-time activities.
6. The create submit CTA is Make It Live.
7. The join CTA is I'm In.
8. Move Chat is temporary and tied to a joined Move.
9. Leave Move should remove the user from the Move and remove the Move Chat from the chat list.
10. Circles are people-based social connections, not recurring themed groups by default.
11. Add to Circle means adding someone you moved with and would move with again.
12. Circle Activity means updates from people you've moved with before.
13. Do not use Crew/Crews language.
14. Do not use Plan/Plans language.
15. Do not use Rally/Rallies language.
16. Do not use Brio as the current user-facing app name.
17. Use clean line icons, not native emoji icons.
18. Logo is wordmark-first with a small yellow custom dot over the "i."
19. Do not use checkered flags, racing visuals, sun icons, spark icons, or heavy lightning/bolt branding.
20. Brielo Livestreams is future/later-stage only, not MVP core.
21. Current prototype should remain localStorage/mock data until backend is intentionally added.
22. Do not add backend, WebSockets, real auth, payments, or livestreaming without explicit approval.

## Show-Up Trust — Phase 1 prototype added

Brielo now has a front-end/localStorage-only "Show-Up Trust" prototype that
discourages flaking fairly. No backend, auth, or persistence beyond `brio_*`
localStorage keys.

Principle:
When a user taps "I'm In," they are holding a limited spot that someone else may
have wanted. Trust is about reliability, not judgment.

Tone: firm, fair, human — never shaming.

Implemented in Phase 1:

* Show-Up Rate (a stat only — never used as a label)
* commitment prompt on limited-spot direct joins ("Save your spot?")
* leaving early is explicitly NOT a no-show; spot reopens
* attendee + host trust labels on Move detail and after-the-move feedback
* private after-the-move feedback nudges trust signals (no permanent marks)
* profile Show-Up Trust section with stats, label, recovery copy, self note
* "How trust works" explainer modal
* reputation recovery through consistent attendance

Approved trust labels (positive): Shows Up, Reliable, Good Vibes, Trusted Host,
Would Move Again, New / Limited History.

Approved warning labels: Recently Missed Moves, Host Review Recommended.

Banned labels — never use as a label: "Low Show-Up Rate", "Low Show Rate",
"flake", "bad user", or any public shaming. "Show-Up Rate" is a stat, not a label.

Icons: Lucide line icons only — no emoji icons.

Future (not yet implemented): server-backed reputation, real safety review
queue, host reliability scoring beyond the prototype values.

## Safety vs. Reports — pre-Move concerns separated from post-Move reports

Brielo separates two distinct safety surfaces so they never feel the same:

* Pre-Move (on Move Detail): a subtle "Something feels off" link opens a softer
  SafetyConcernModal. It is a private safety note for review — not a public
  report and never a penalty. Copy: "Something feels off?" / "Tell us what's
  making you unsure. We'll use this to review the Move." → 6 options →
  "Add a few details" → Cancel / Send for Review. Notification:
  "Your safety note was sent for review."
* Post-Move (post-move.tsx): the formal "Report this Move" flow — "Tell us what
  happened. Reports are private." → 8 options → "Add details" →
  Cancel / Submit Report. Notification: "Your report was submitted for review."
* After-the-Move attendee feedback: "Felt off" opens the softer SafetyConcernModal
  (postMove context); "Report" opens the formal report flow.

Both are stored front-end only in `brio_safety_reports`
({ id, moveId, moveName, reportContext: preMove|postMove, reportType, details,
createdAt, status: "submitted" }). No backend, no moderation queue, nothing public.
Shared toast for both: "Thanks. We'll review this." Lucide line icons only.
