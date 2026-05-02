# Requirements — History heatmap (Phase 4)

> Tick `[x]` as each is shipped. All must pass before merging.

## Date layer (extend the boundary)
- [x] R1: `lib/date.ts` exports `addDays(dateKey, n: number): DateKey` (positive or negative)
- [x] R2: `lib/date.ts` exports `mondayOfWeek(dateKey): DateKey` — uses `date-fns`'s `startOfWeek({ weekStartsOn: 1 })`
- [x] R3: `lib/date.ts` exports `buildHeatmapGrid(todayKey, weeks=12): DateKey[][]` returning `weeks` columns × 7 rows; rightmost column contains today; row 0 = Monday, row 6 = Sunday
- [x] R4: `lib/date.ts` exports `formatHeatmapTitle(dateKey, done): string` — e.g. `"Mon, Apr 21 — done"` / `"Tue, Apr 22 — not done"`

## Storage / hook
- [x] R5: `hooks/useHabits.ts` adds `toggleDate(habitId, dateKey)` that flips state for any date and persists via existing `markDone` / `unmarkDone`
- [x] R6: `toggleToday` continues to work (now a thin wrapper around `toggleDate`)
- [x] R7: No new `localStorage` access outside `lib/storage.ts`; no new `Date` math outside `lib/date.ts`

## UI components
- [x] R8: `<Heatmap />` accepts `{ dates: readonly DateKey[]; todayKey: DateKey; color: HabitColor; onToggle: (dateKey: DateKey) => void }`
- [x] R9: `<Heatmap />` renders 12 columns × 7 rows in a CSS grid
- [x] R10: Cells whose date is in `dates` show a solid tint of `color`; not-done cells show a neutral light gray
- [x] R11: Cells with `dateKey > todayKey` are visually faded, have `aria-disabled="true"` and `role="gridcell"`, and do nothing on click
- [x] R12: Cells with `dateKey <= todayKey` are `<button>` elements with `title={formatHeatmapTitle(...)}` and click handler calling `onToggle(dateKey)`
- [x] R13: `<HabitCard />` shows a chevron button at the right side (aria-label: "Show history" / "Hide history", `aria-expanded` reflects state)
- [x] R14: Card local state controls expansion; expanding renders `<Heatmap />` below the existing row
- [x] R15: Expansion does not interfere with the three-dot menu, the check button, or the streak badge

## Page wiring
- [x] R16: `<HabitCard />` accepts an `onToggleDate` prop and forwards `(dateKey) => toggleDate(habit.id, dateKey)`
- [x] R17: `app/page.tsx` passes `onToggleDate` to each `<HabitCard />`

## Behaviour
- [x] R18: Clicking a cell that is currently "not done" → cell fills, tooltip updates to "— done", streak badge recomputes, storage updated
- [x] R19: Clicking a cell that is currently "done" → cell empties, tooltip updates to "— not done", streak recomputes, storage updated
- [x] R20: Refreshing the page shows the same heatmap state (read from existing `completions`)
- [x] R21: Toggling the heatmap expansion state on one card does not affect any other card's expansion state

## Non-functional
- [x] R22: No `any` types
- [x] R23: No console errors or React key warnings (every cell has a stable key = its dateKey)
- [x] R24: All Phase 1 + 2 + 3 validations still pass (no regression)
- [x] R25: New unit tests cover: `addDays`, `mondayOfWeek`, `buildHeatmapGrid` shape (12×7) + last-cell-equals-today, `formatHeatmapTitle`, plus a UI flow for cell-click-toggles and a future-cell-is-disabled assertion
