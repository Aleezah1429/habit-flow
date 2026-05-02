# Changelog

All notable changes to HabitFlow are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows the rule in `.claude/skills/release-phase/SKILL.md` (one minor bump per shipped roadmap phase).

---

## [v0.4.0] — 2026-05-02

History lands. Each habit card now expands to reveal a 12-week heatmap (Monday-start, GitHub-style). Click any past or today cell to backfill or correct that day. Phase 4 of the roadmap.

### Added
- 12-week × 7-day heatmap per habit, expandable via a chevron on the card.
- Click any past or today cell to toggle that day's status — fixes the long-standing "I forgot to log yesterday" friction.
- Native browser tooltips on every cell: `Mon, Apr 21 — done` / `Tue, Apr 22 — not done`.
- Future cells render as visibly-faded `aria-disabled` placeholders so the grid stays a perfect 12×7 = 84 cells regardless of weekday.
- `lib/date.ts` extended with `addDays`, `mondayOfWeek`, `buildHeatmapGrid`, `formatHeatmapTitle` — all date math stays inside this single boundary.
- 12 new tests cover the date math (grid shape, last-cell-equals-today, Mon→Sun row order) and the UI flow (expand/collapse, cell click toggles storage + streak badge).

### Changed
- `useHabits` API: new `toggleDate(habitId, dateKey)` for arbitrary-date toggles. `toggleToday` becomes a thin wrapper — Phase 2/3 callers still work unchanged.
- `<HabitCard />` API: now requires an `onToggleDate` prop in addition to `onToggle`. Card layout switched from a single inline row to a flex column so the heatmap can sit beneath the existing controls when expanded.

### Decisions worth recording
- **Monday-start columns** (ISO standard) — matches `date-fns` defaults and most non-US calendars.
- **Today is editable in the heatmap** too — same toggle as the dedicated CheckButton at the top of the card; both stay in sync.
- **No custom tooltip component** — native `title` attribute is good enough for v1 and gives free a11y.

---

## [v0.3.0] — 2026-04-28

Streaks land. Every habit card now shows the current consecutive-day streak (with a flame icon) and the all-time longest run. Phase 3 of the roadmap.

### Added
- Per-habit "🔥 N day streak" + "Best N" display on every card.
- `lib/streak.ts` — pure module with `currentStreak`, `longestStreak`, `computeStreaks`. No React, no storage; tested with 11 unit cases (gap resets, future-date defense, duplicate-date defense, today-must-be-earned semantics, the roadmap's 7-day "definition of done").
- `lib/date.ts` extended with `previousDay()` so the streak walker stays inside the date boundary (`date-fns` `subDays`).
- `<StreakBadge />` component — graceful "No streak yet" empty state until the user has any history, then a compact two-line badge.
- 3 new RTL tests covering the on-page streak display: empty state, live update on mark, recompute on un-mark.

### Changed
- `<HabitCard />` API: now accepts `dates: readonly DateKey[]` and `todayKey: DateKey` props. The three-dot menu is now positioned at the card's top-right corner so the streak block can claim the inline right column.
- `app/page.tsx` computes `todayKey()` once per render and passes it down — single source of truth for "today" across the page.

### Decisions worth recording
- **"Today must be earned"** — current streak is 0 until today is actually checked, even if a long run ends yesterday. Pushes consistent daily action.
- **Longest is computed from current data, not a stored high-water mark** — keeps the mission's *honest history* value. Un-marking a day that was part of the longest run will reduce it; the spec was tightened to reflect this after the first test run revealed the contradiction.

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
