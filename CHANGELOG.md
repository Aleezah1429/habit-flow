# Changelog

All notable changes to HabitFlow are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the rule in `.claude/skills/release-phase/SKILL.md` (one minor bump per shipped roadmap phase).

---

## [v0.1.0] — 2026-04-25

First shippable cut: full CRUD over local-only habits. Phase 1 of the roadmap.

### Added
- Create habits with a name, a lucide icon, and a color (8-swatch palette, ~30 curated icons).
- List habits as a responsive card grid (1 / 2 / 3 columns).
- Edit and delete habits via a three-dot menu on each card; delete asks for confirmation.
- Empty state on the home page when no habits exist.
- Persistence to `localStorage` under the namespaced key `habit-flow:v1`; survives refresh and corrupt-JSON gracefully.
- Vitest + React Testing Library setup with 9 tests covering storage layer + key user flows.
- `feature-spec` skill (Step 2 of the spec-driven workflow) and `release-phase` skill (Step 6).

### Fixed
- Dialogs were rendering against the left edge because Tailwind v4's preflight resets `margin: 0` on every element, breaking the native `<dialog>` centering. Now restored with `m-auto`.

### Internal
- Project scaffolded with Next.js 16.2.4 (App Router), React 19, Tailwind v4, TypeScript strict.
- Specs in `specs/`: `mission.md`, `tech.md`, `roadmap.md`.
- Per-feature design docs in `features/habit-crud/`: `plan.md`, `requirements.md`, `validations.md`.
- All `localStorage` access funneled through `lib/storage.ts` (single boundary).
- Custom hook `useHabits` bridges storage with React state, hydrating inside `useEffect` to avoid SSR/client mismatch.
