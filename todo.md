# todo.md

Loose, informal capture. **Not a roadmap** — for that see [specs/roadmap.md](./specs/roadmap.md). Things here are either too small to be a phase, or might never happen.

## Up next (Phase 3 prep — Streaks)

- Decide: streak math lives in `lib/streak.ts` (new file) consuming `Completions` + `todayKey()`. Pure function, easy to unit-test.
- Decide: how to handle "today's streak" if today is *not* yet checked? Two reads: `currentStreakIncludingToday` vs `currentStreakAsOfYesterday` — pick one for the card display.
- Define edge cases up-front: a single completion = streak of 1; gap of one day breaks it; future-dated entries (shouldn't exist but be defensive) ignored.
- Card layout: where do "current X / longest Y" labels go? Below the habit name? Right of the icon? Sketch in plan.md.
- Performance check: with 365 days × 10 habits the array is tiny, but if we ever hit 5+ years × 50 habits, sort + group will matter — premature for now.

## Polish ideas (small, can ship anytime)

- Subtle entrance animation when a new habit card is added
- Animate the check button — slight scale-bounce on toggle
- Form: cmd/ctrl + Enter to save
- Form: pressing Tab from name → first icon
- Card hover: show a subtle "drag handle" in preparation for Phase 7 reorder
- Lighter shadow on cards in dark mode (current shadow disappears)
- Today header could fade-in to avoid initial blank flash on hydrate

## Bugs / rough edges

- Empty-state icon (Sprout) feels a bit small — try `size={40}`?
- On mobile, the "New habit" button text could be hidden in favor of just `+` icon
- First render flashes empty state for a moment because `hydrated` only flips on next tick — investigate `useSyncExternalStore` instead
- `TodayHeader` renders an empty space until `useEffect` runs (avoids SSR/local-time mismatch). Acceptable for now; revisit if we ever want SSR.
- If the tab is left open across midnight, cards still show *yesterday*'s checked state until refresh — document, don't fix in v1 (auto-rollover is out of scope per plan.md).

## Tech debt

- Add ESLint rule `no-restricted-imports` to forbid importing `localStorage` outside `lib/storage.ts` and raw `Date` outside `lib/date.ts` (currently enforced by review only).
- Extract dialog-centering CSS into globals.css instead of repeating `m-auto` per dialog.
- `useHabits.update` and `storage.updateHabit` duplicate the patch-merge logic — extract a `applyHabitPatch(habit, patch)` helper to `lib/types.ts`.
- Pre-existing lint error: `react-hooks/set-state-in-effect` flags the hydration `useEffect` in `useHabits`. Standard hydration pattern; revisit by trying `useSyncExternalStore` for the localStorage subscription.

## Maybe-someday (out of v1 scope)

- Browser notification reminders
- Supabase backend for multi-device sync
- Habit templates (Atomic Habits starter pack)
- Keyboard-only power-user mode
- Export/import data as JSON (already in Phase 7 — listed here for visibility)

## Docs / process

- After Phase 3 ships, write a `phase-impl` skill that captures Step 3 (foundation files → components → page wiring) — recurring pattern is now visible across two phases.
- Add a "Why I built this" section to README once Phase 4 (heatmap) is in.
- Consider: a tiny `scripts/seed-demo-data.ts` to populate `localStorage` with 7-day-ish history for Phase 3/4 dev work without hand-clicking.
