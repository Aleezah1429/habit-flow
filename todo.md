# todo.md

Loose, informal capture. **Not a roadmap** — for that see [specs/roadmap.md](./specs/roadmap.md). Things here are either too small to be a phase, or might never happen.

## Up next (Phase 2 prep)

- [ ] Decide: where does "today" live in state? `useHabits` hook or a new `useToday` hook?
- [ ] Decide: store check-ins as an array of `{habitId, date}` rows, or as `Record<habitId, Set<date>>`?
- [ ] Date helpers needed: `lib/date.ts` with `today()`, `isSameDay()`, `daysAgo(n)` — date-fns thin wrapper
- [ ] Need a "today" indicator in the header (e.g. "Friday, Apr 25")

## Polish ideas (small, can ship anytime)

- [ ] Subtle entrance animation when a new habit card is added
- [ ] Form: cmd/ctrl + Enter to save
- [ ] Form: pressing Tab from name → first icon
- [ ] Card hover: show a subtle "drag handle" in preparation for Phase 7 reorder
- [ ] Lighter shadow on cards in dark mode (current shadow disappears)

## Bugs / rough edges

- [ ] Empty-state icon (Sprout) feels a bit small — try `size={40}`?
- [ ] On mobile, the "New habit" button text could be hidden in favor of just `+` icon
- [ ] First render flashes empty state for a moment because `hydrated` only flips on next tick — investigate `useSyncExternalStore` instead

## Tech debt

- [ ] Add ESLint rule `no-restricted-imports` to forbid importing `localStorage` outside `lib/storage.ts` (currently enforced by review only — see R25)
- [ ] Extract dialog-centering CSS into globals.css instead of repeating `m-auto` per dialog
- [ ] `useHabits.update` and `storage.updateHabit` duplicate the patch-merge logic — extract a `applyHabitPatch(habit, patch)` helper to `lib/types.ts`

## Maybe-someday (out of v1 scope)

- [ ] Browser notification reminders
- [ ] Supabase backend for multi-device sync
- [ ] Habit templates (Atomic Habits starter pack)
- [ ] Keyboard-only power-user mode
- [ ] Export/import data as JSON (already in Phase 7 — listed here for visibility)

## Docs / process

- [ ] After Phase 2 ships, write a `phase-impl` skill that captures Step 3 (foundation files → components → page wiring)
- [ ] Add a "Why I built this" section to README once Phase 4 (heatmap) is in
