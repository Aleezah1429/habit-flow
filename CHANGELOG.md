# Changelog

All notable changes to HabitFlow are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the rule in `.claude/skills/release-phase/SKILL.md` (one minor bump per shipped roadmap phase).

---

## [v0.2.0] — 2026-04-26

Daily check-in lands. Mark a habit done today with one click; refresh keeps today's state. Phase 2 of the roadmap.

### Added
- Round check button on every habit card to mark a habit done today; click again to un-mark (mistake recovery).
- Visible "done today" state — the card itself fills with a soft tint of the habit's color and the check button fills with the swatch color.
- Today's date heading at the top of the home page (e.g. `"Sunday, April 26"`), so the page is grounded in *now*.
- Storage extended with a top-level `completions: { [habitId]: ['YYYY-MM-DD', ...] }` map; `getCompletions`, `markDone`, `unmarkDone`, `isDone`.
- `lib/date.ts` as the single boundary for date math (`todayKey`, `formatToday`), per the same rule that scopes `lib/storage.ts`.
- `useHabits` hook now exposes `toggleToday(habitId)` and `isDoneToday(habitId)`.
- 12 new tests covering check-in storage (round-trip, idempotency, no-op unmark, forward-compat with old data) and toggle UX (sibling independence, hydration, no menu collision, deletion clears completions).
- `date-fns` added as a dependency (was already declared in `specs/tech.md`).

### Changed
- `deleteHabit(id)` now also drops that habit's completions entry, preventing orphan history.
- `<HabitCard />` API: now requires `checked` and `onToggle` props; clicks on the card body do not toggle (only the dedicated `<CheckButton />` does), which keeps the three-dot menu unaffected.
- Header redesigned: the small "HabitFlow" tagline is now an eyebrow above the prominent today's-date heading.

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
