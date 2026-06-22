Update the project README for Brielo.

Goal:
Make the README clearly explain what Brielo is, where the live demo is, how to run the project locally, and what the current prototype status is.

Use this live demo URL:
https://brielo-prototype-api-server-1o2u.vercel.app

README should include:

1. Project name

# Brielo

2. Short description
   Brielo is a social lifestyle app prototype that helps people make real-life Moves, meet through activities, and build a trusted Circle of people they would move with again.

3. Live demo section
   Include:
   Live Demo:
   https://brielo-prototype-api-server-1o2u.vercel.app

Mention that the public demo is deployed on Vercel.

4. Current prototype status
   Mention:

* Backend Phase 1 local storage foundation is complete
* Create Move works
* Join normal Move works
* Leave Move works
* Host-approval Request to Join does not auto-join
* Cancel Request works
* Hosted Cancel Move works
* Vercel SPA refresh routing is fixed

5. Tech stack
   Mention:

* React
* TypeScript
* Vite
* localStorage prototype data layer
* pnpm workspace
* Vercel deployment

6. Local development
   Include these commands:

```bash
pnpm install
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/rally dev
```

7. Validation commands
   Include:

```bash
pnpm --filter @workspace/rally typecheck
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/rally build
```

8. Project structure note
   Mention that the active prototype currently lives in:

```text
artifacts/rally
```

Do not rename folders or routes yet, even though the user-facing product name is Brielo.

9. Product language note
   Mention:
   User-facing language should use Brielo, Moves, Make a Move, I’m In, Request to Join, Cancel Request, Move Chat, Circle, and Show-Up Trust.

Avoid user-facing Rally, Brio, Plans, Crews, RSVP, Flake, or Low Show-Up Rate language.

10. Roadmap / next steps
    Include:

* Public demo QA pass
* Landing page and waitlist
* User feedback collection
* Request to Join and Ask Host backend phase
* Move Chat and Circle backend phase
* Trust and safety backend phase

Keep the README professional but simple. Avoid overhyping the app. Do not add fake users, fake revenue, fake production claims, or claims that Brielo has a real backend yet.
