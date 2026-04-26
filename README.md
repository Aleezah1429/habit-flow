# HabitFlow 🌱

A minimal, fast habit tracker. Mark a habit done today — watch your streak grow. No accounts, no notifications, no bloat.

> **Status**: v0.1.0 — Phase 1 (Habit CRUD) shipped. See [CHANGELOG.md](./CHANGELOG.md) and [specs/roadmap.md](./specs/roadmap.md) for what's next.

## What's inside

- **Add habits** with a name, an icon (30 curated lucide icons), and a color.
- **Edit / delete** habits via a per-card three-dot menu (delete asks for confirmation).
- **Persistence** to `localStorage` — survives refresh, no backend needed.
- **Empty state** when there are no habits yet.
- **Responsive** — 1 / 2 / 3 column grid for mobile / tablet / desktop.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind v4 |
| Icons | lucide-react |
| Persistence | `localStorage` (v1) |
| Tests | Vitest + React Testing Library |
| State (planned, Phase 6+) | Zustand |

Full rationale in [specs/tech.md](./specs/tech.md).

## Quick start

```bash
npm install        # one-time
npm run dev        # http://localhost:3000
npm run test       # watch mode
npm run test:run   # one-shot (CI-style)
npm run lint       # eslint
```

## Project structure

```
app/                      # Next.js routes — currently just home
components/               # Reusable UI (PascalCase)
features/<feature>/       # Per-feature spec docs (plan, requirements, validations)
hooks/                    # Custom React hooks
lib/                      # Pure helpers (storage, ids, types)
specs/                    # Project-level specs: mission, tech, roadmap
tests/                    # Vitest test files
.claude/skills/           # Reusable agent workflows
```

## How this project is built — *spec-driven development*

Every feature follows the same 7-step rhythm. The discipline is **think on paper before typing code**. Full reference + cheat sheet in **[WORKFLOW.md](./WORKFLOW.md)** — read it before starting any new phase.

| Step | Output |
|---|---|
| 0. Project specs | [specs/mission.md](./specs/mission.md) · [specs/tech.md](./specs/tech.md) · [specs/roadmap.md](./specs/roadmap.md) |
| 1. Pick next phase + branch | `feature/phase-N-<name>` |
| 2. Spec the feature | `features/<feature>/plan.md` · `requirements.md` · `validations.md` |
| 3. Implement | Tick `requirements.md` and `roadmap.md` as you go |
| 4. Test | `tests/app.test.tsx` (Vitest + RTL) |
| 5. Responsive UI audit | Mobile / tablet / desktop |
| 6. Release | CHANGELOG entry, merge to `main`, tag |
| 7. Docs | README + `todo.md` updates |

Step 2 and Step 6 are captured as Claude Code skills so they don't have to be re-explained:
- **[feature-spec](./.claude/skills/feature-spec/SKILL.md)** — scaffolds the three per-feature spec files
- **[release-phase](./.claude/skills/release-phase/SKILL.md)** — closes out a phase (changelog, merge, tag)

## Roadmap

Phases (each = one shippable PR):

- [x] **v0.1.0** — Phase 1: Habit CRUD
- [ ] v0.2.0 — Phase 2: Daily check-in
- [ ] v0.3.0 — Phase 3: Streaks
- [ ] v0.4.0 — Phase 4: History heatmap
- [ ] v0.5.0 — Phase 5: Categories & filters
- [ ] v0.6.0 — Phase 6: Stats dashboard (Zustand introduced here)
- [ ] v1.0.0 — Phase 7: Polish & ship

Detail in [specs/roadmap.md](./specs/roadmap.md). Loose ideas in [todo.md](./todo.md).

## Conventions (hard rules)

- No `any` type — use `unknown` and narrow.
- All `localStorage` access goes through [lib/storage.ts](./lib/storage.ts) — single boundary.
- Every feature must have a `validations.md` before merging.
- Tests live in `tests/`, not co-located.
