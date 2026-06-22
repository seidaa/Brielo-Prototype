# Brielo

Brielo is a social lifestyle app prototype that helps people make real-life Moves, meet through activities, and build a trusted Circle of people they would move with again.

## Live Demo

Live Demo:
https://brielo-prototype-api-server-1o2u.vercel.app

The public demo is deployed on Vercel.

## Current Prototype Status

This is an early prototype. Brielo does not have a real backend yet — the app currently runs on a localStorage-based data layer.

- Backend Phase 1 localStorage foundation is complete
- Create Move works
- Join normal Move works
- Leave Move works
- Host-approval Request to Join does not auto-join
- Cancel Request works
- Hosted Cancel Move works
- Vercel SPA refresh routing is fixed

## Tech Stack

- React
- TypeScript
- Vite
- localStorage prototype data layer
- pnpm workspace
- Vercel deployment

## Local Development

```bash
pnpm install
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/rally dev
```

## Validation Commands

```bash
pnpm --filter @workspace/rally typecheck
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/rally build
```

## Project Structure

The active prototype currently lives in:

```text
artifacts/rally
```

Folders and routes are not renamed yet, even though the user-facing product name is Brielo.

## Product Language

User-facing language should use Brielo, Moves, Make a Move, I'm In, Request to Join, Cancel Request, Move Chat, Circle, and Show-Up Trust.

Avoid user-facing Rally, Brio, Plans, Crews, RSVP, Flake, or Low Show-Up Rate language.

## Roadmap / Next Steps

- Public demo QA pass
- Landing page and waitlist
- User feedback collection
- Request to Join and Ask Host backend phase
- Move Chat and Circle backend phase
- Trust and safety backend phase
