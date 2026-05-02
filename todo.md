# todo.md

Loose, informal capture. **Not a roadmap** — for that see [specs/roadmap.md](./specs/roadmap.md). Things here are either too small to be a phase, or might never happen.

## Up next (Phase 5 prep — Categories & filters)

- Decide: category as a fixed enum (Health/Mind/Work/Other) or free-text tag? Fixed enum keeps the "minimal" feel and matches the curated-icons-and-colors precedent.
- Storage shape: add `category: HabitCategory` to `Habit`. Migration: existing habits without a category default to `'other'` on read (defensive, in `lib/storage.ts`).
- Filter UI: a row of chips at the top of the home page? Or a dropdown next to "New habit"? Chips are clearer at a glance.
- "All" pseudo-filter that's always selected by default and never disabled.
- Empty-filter state: "No habits in *Health* yet — add one to get started" (vs. global empty state).
- Category color accent: a small dot or stripe on the card. Don't conflict with the existing per-habit color (which is identity, not category).
- Form: when creating a habit, category picker sits between Icon and Color sections.

## Polish ideas (small, can ship anytime)

- Subtle entrance animation when a new habit card is added.
- Animate the streak number on increment (slight bounce) when toggle flips.
- Heatmap: tiny month label row above the grid (Feb / Mar / Apr) so the time axis is more readable.
- Heatmap: a minimum-touch-target audit at 375px — currently cells are tiny. Maybe a "compact / large" toggle.
- Form: cmd/ctrl + Enter to save.
- Form: pressing Tab from name → first icon.
- Card hover: show a subtle "drag handle" in preparation for Phase 7 reorder.
- Lighter shadow on cards in dark mode (current shadow disappears).
- Streak badge when current === longest > 1 — add a "🏆 personal best" microbadge.

## Bugs / rough edges

- Empty-state icon (Sprout) feels a bit small — try `size={40}`?
- On mobile, the "New habit" button text could be hidden in favor of just `+` icon.
- First render flashes empty state for a moment because `hydrated` only flips on next tick — investigate `useSyncExternalStore` instead.
- `TodayHeader` renders an empty space until `useEffect` runs (avoids SSR/local-time mismatch). Acceptable for now; revisit if we ever want SSR.
- If the tab is left open across midnight, the heatmap's "today" doesn't roll over until refresh. Document this rather than fix in v1.
- Heatmap cells use `aspect-square`; on very narrow screens they may be sub-touch-target size. Audit at 320px.

## Tech debt

- Add ESLint rule `no-restricted-imports` to forbid importing `localStorage` outside `lib/storage.ts` and raw `Date` outside `lib/date.ts` (currently enforced by review only).
- Extract dialog-centering CSS into globals.css instead of repeating `m-auto` per dialog.
- `useHabits.update` and `storage.updateHabit` duplicate the patch-merge logic — extract a `applyHabitPatch(habit, patch)` helper to `lib/types.ts`.
- Pre-existing lint error: `react-hooks/set-state-in-effect` flags the hydration `useEffect` in `useHabits`. Standard hydration pattern; revisit by trying `useSyncExternalStore` for the localStorage subscription.
- `longestStreak` calls `previousDay` once per array element during the sort-walk. Fine for v1; revisit if Phase 6 stats start crunching multi-year data.
- `HabitCard` is now ~90 lines and has multiple concerns (display, expansion state, streak compute, heatmap). Consider splitting into `HabitCardCompact` + `HabitCardExpanded` if Phase 5 (categories) adds more.

## Maybe-someday (out of v1 scope)

- Browser notification reminders.
- Supabase backend for multi-device sync.
- Habit templates (Atomic Habits starter pack).
- Keyboard-only power-user mode.
- Export/import data as JSON (already in Phase 7 — listed here for visibility).
- Drag-across-cells to bulk-toggle multiple days in the heatmap.

## Docs / process

- After Phase 5 ships, write a `phase-impl` skill capturing Step 3's recurring rhythm (foundation files → components → page wiring) — pattern is now visible across four phases.
- Add a "Why I built this" section to README once Phase 6 (stats) is in.
- Consider: a tiny `scripts/seed-demo-data.ts` to populate `localStorage` with multi-week history for Phase 6 dev work without hand-clicking.
