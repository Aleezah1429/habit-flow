# Requirements — Habit CRUD (Phase 1)

> Tick `[x]` as each is shipped. All must pass before merging.

## Types & data
- [x] R1: `Habit`, `HabitColor`, `HabitIconName` types defined in `lib/types.ts`
- [x] R2: `COLOR_OPTIONS` array (8 fixed swatches with name + hex/Tailwind class) exported from `lib/types.ts`
- [x] R3: `ICON_OPTIONS` array (~30 curated lucide icon names) exported from `lib/types.ts`

## Storage layer (the only place that touches `localStorage`)
- [x] R4: `lib/storage.ts` exposes: `getHabits()`, `addHabit(input)`, `updateHabit(id, patch)`, `deleteHabit(id)`
- [x] R5: Storage key namespaced as `habit-flow:v1`
- [x] R6: `getHabits()` returns `[]` when key missing or JSON corrupt (no crash)
- [x] R7: All writes are synchronous — caller doesn't await

## ID generation
- [x] R8: `lib/ids.ts` exports `newId()` wrapping `crypto.randomUUID()` (mockable for tests)

## Hook
- [x] R9: `hooks/useHabits.ts` exposes `{ habits, add, update, remove }` and stays in sync with storage
- [x] R10: Hook hydrates on mount (avoids SSR/client mismatch — read inside `useEffect`)

## UI components
- [x] R11: `<HabitFormDialog />` — controlled modal with: name input (1–40 chars), `<IconPicker />`, `<ColorPicker />`, Save / Cancel
- [x] R12: `<IconPicker />` — grid of `ICON_OPTIONS`, click-to-select, selected has visible ring
- [x] R13: `<ColorPicker />` — row of swatches, click-to-select, selected has visible ring
- [x] R14: `<HabitCard />` — shows icon, name, color accent, three-dot menu trigger
- [x] R15: `<HabitMenu />` — dropdown with "Edit" and "Delete" actions
- [x] R16: `<ConfirmDialog />` — reusable; used by delete flow

## Page wiring
- [x] R17: `app/page.tsx` lists habits in a responsive grid
- [x] R18: "New habit" button (top-right) opens `<HabitFormDialog />` in create mode
- [x] R19: `<HabitMenu />` "Edit" opens dialog in edit mode (pre-filled)
- [x] R20: `<HabitMenu />` "Delete" opens `<ConfirmDialog />`; confirm → habit removed

## Validation rules
- [x] R21: Empty name → Save button disabled, helper text shown
- [x] R22: Name >40 chars → blocked at input level (maxLength)
- [x] R23: Default selections when opening create dialog: first icon, first color

## Persistence sanity
- [x] R24: After add/edit/delete, refresh page → state is identical
- [x] R25: No `localStorage` access in any file outside `lib/storage.ts` (enforced by review, not lint)

## Non-functional
- [x] R26: No `any` types anywhere
- [x] R27: No console errors or React key warnings on home page
- [x] R28: Empty state visible when `habits.length === 0`
