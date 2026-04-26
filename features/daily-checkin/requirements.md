# Requirements — Daily Check-in (Phase 2)

> Tick `[x]` as each is shipped. All must pass before merging.

## Types & data
- [x] R1: `DateKey` and `Completions` types added to `lib/types.ts`
- [x] R2: `StoredV1` shape updated to `{ habits: Habit[]; completions: Completions }`

## Date layer (the only place that touches `Date` math)
- [x] R3: `lib/date.ts` created — no other file does date arithmetic
- [x] R4: `todayKey()` returns local-timezone `'YYYY-MM-DD'` string
- [x] R5: `formatToday(date)` returns user-facing string like `'Sunday, April 26'` (uses `date-fns`)

## Storage layer (the only place that touches `localStorage`)
- [x] R6: `lib/storage.ts` adds `getCompletions()` returning `Completions` (`{}` when missing/corrupt)
- [x] R7: `markDone(habitId, dateKey)` adds the date if not already present (no duplicates)
- [x] R8: `unmarkDone(habitId, dateKey)` removes the date if present (no-op otherwise)
- [x] R9: `isDone(habitId, dateKey)` returns boolean
- [x] R10: `deleteHabit(id)` ALSO removes that habit's completions entry (no orphans)
- [x] R11: Reading old data without `completions` key does not crash (returns `{}`)

## Hook
- [x] R12: `useHabits()` exposes `completions`, `toggleToday(habitId)`, `isDoneToday(habitId)`
- [x] R13: `toggleToday()` flips state for `todayKey()` and persists synchronously
- [x] R14: Hook hydrates completions on mount alongside habits (single `useEffect`)

## UI components
- [x] R15: `<TodayHeader />` renders `formatToday(new Date())`, large + prominent, above the grid
- [x] R16: `<CheckButton />` — controlled (`checked`, `onToggle`, `color`), round, accessible (`role="checkbox"` + `aria-checked`)
- [x] R17: `<CheckButton />` unchecked = outlined ring in the habit color; checked = filled habit color with check icon
- [x] R18: `<HabitCard />` renders `<CheckButton />` and reflects checked state on the card itself (light color tint background + small check overlay near the icon)
- [x] R19: `<HabitCard />` clicks on the card body do NOT toggle — only `<CheckButton />` does (still allows three-dot menu to work uninterrupted)

## Page wiring
- [x] R20: `app/page.tsx` mounts `<TodayHeader />` above the habits grid
- [x] R21: Each `<HabitCard />` receives `checked={isDoneToday(habit.id)}` and `onToggle={() => toggleToday(habit.id)}`

## Persistence sanity
- [x] R22: Mark a habit done → refresh → still checked
- [x] R23: Un-mark a habit → refresh → still unchecked
- [x] R24: Delete a habit → its `completions` entry is gone from storage
- [x] R25: No `localStorage` access outside `lib/storage.ts`
- [x] R26: No raw `Date` arithmetic outside `lib/date.ts`

## Non-functional
- [x] R27: No `any` types
- [x] R28: No console errors or React key warnings
- [x] R29: `<CheckButton />` is keyboard-operable (Space toggles, Tab focuses)
- [x] R30: All Phase 1 validations still pass (no regression)
