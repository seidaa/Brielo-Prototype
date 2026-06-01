# Brielo Cleanup Backlog

These are cleanup items for later. Do not complete them unless specifically requested.

## Internal Naming Cleanup

The app currently lives in artifacts/rally. Do not rename this folder yet because it may break imports/build paths.

Later cleanup:

* Rename useRallies to useMoves
* Rename addRally to addMove
* Rename joinRally to joinMove
* Rename leaveRally to leaveMove
* Rename rally-detail route/page to move-detail
* Change route /rally/:id to /move/:id
* Update package name @workspace/rally to a Brielo/Move-based name

## User-Facing Cleanup

Search for and remove leftover:

* Rally
* Rallies
* Brio
* Plan
* Plans
* Crew
* Crews
* RSVP language
* emoji icons

## UI Cleanup

* Replace remaining emoji icons with clean line icons
* Make sure Leave Move removes Move Chat from chat list
* Confirm created Moves still appear in Discover
* Confirm localStorage still works
* Confirm dark/light/auto themes still work

## Future Feature Backlog

Do not build yet:

* trust/reputation system
* flaking penalties
* real backend
* real auth
* WebSockets
* push notifications
* payments
* livestreaming
* AI matching
* venue dashboards
