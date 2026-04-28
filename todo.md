# todo.md

Loose, informal capture. **Not a roadmap** — for that see [specs/roadmap.md](./specs/roadmap.md). Things here are either too small to be a phase, or might never happen.

## Up next (Phase 4 prep — History heatmap)

- 12 weeks × 7 days = 84 cells per habit. Per-row (one habit) or all-habits-stacked? Lean per-row inside an expanded card view, or new `/habit/[id]` route.
- Click any cell → toggle that day's status. This means `lib/storage.ts` needs a `setDoneOn(habitId, dateKey, done: bool)` helper (or just exposing `markDone` / `unmarkDone` for arbitrary dates is enough).
- Hover / focus on a cell → tooltip "Tue, Apr 22 — done" / "Tue, Apr 22 — not done".
- Color scale: a single tint of the habit color works (binary state — done or not). No "intensity" because there is no count, just a boolean.
- Date range: build the 12 weeks ending today; Sunday-start vs Monday-start needs a quick decision.
- Storage shape stays the same — `completions[habitId]: DateKey[]` already supports past dates; we just expose UI to write them.
- Perf: 12×7×N habits ~ 1k cells worst case. SVG vs CSS grid — CSS grid is simpler.

## Polish ideas (small, can ship anytime)

- Subtle entrance animation when a new habit card is added.
- Animate the streak number on increment (slight bounce) when toggle flips.
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
- If the tab is left open across midnight, cards still show *yesterday*'s checked state until refresh — document, don't fix in v1 (auto-rollover is out of scope per plan.md).
- `<HabitCard />` is now ~50 lines and reads from completions; if Phase 4 lets cells edit past days, the card may need split into a "compact" view + an "expanded" view.

## Tech debt

- Add ESLint rule `no-restricted-imports` to forbid importing `localStorage` outside `lib/storage.ts` and raw `Date` outside `lib/date.ts` (currently enforced by review only).
- Extract dialog-centering CSS into globals.css instead of repeating `m-auto` per dialog.
- `useHabits.update` and `storage.updateHabit` duplicate the patch-merge logic — extract a `applyHabitPatch(habit, patch)` helper to `lib/types.ts`.
- Pre-existing lint error: `react-hooks/set-state-in-effect` flags the hydration `useEffect` in `useHabits`. Standard hydration pattern; revisit by trying `useSyncExternalStore` for the localStorage subscription.
- `longestStreak` calls `previousDay` once per array element during the sort-walk (string→date→string parse). For 365×N years this is fine; if Phase 6 stats start crunching multi-year data, swap to numeric day-index arithmetic.

## Maybe-someday (out of v1 scope)

- Browser notification reminders.
- Supabase backend for multi-device sync.
- Habit templates (Atomic Habits starter pack).
- Keyboard-only power-user mode.
- Export/import data as JSON (already in Phase 7 — listed here for visibility).

## Docs / process

- After Phase 4 ships, write a `phase-impl` skill capturing Step 3's recurring rhythm (foundation files → components → page wiring) — pattern is now visible across three phases.
- Add a "Why I built this" section to README once Phase 4 (heatmap) is in.
- Consider: a tiny `scripts/seed-demo-data.ts` to populate `localStorage` with multi-week history for Phase 4/6 dev work without hand-clicking.
