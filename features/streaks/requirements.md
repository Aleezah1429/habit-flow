# Requirements — Streaks (Phase 3)

> Tick `[x]` as each is shipped. All must pass before merging.

## Date layer (extend the boundary)
- [x] R1: `lib/date.ts` exports `previousDay(dateKey: DateKey): DateKey` — local-tz safe (uses `date-fns`'s `subDays`)
- [x] R2: No raw `Date` arithmetic outside `lib/date.ts` (still enforced by review)

## Streak layer (new pure module)
- [x] R3: `lib/streak.ts` created — no React, no localStorage, no `Date` arithmetic (only `previousDay()` from `lib/date.ts`)
- [x] R4: `currentStreak(dates, todayKey)` returns 0 when `todayKey` not in `dates`
- [x] R5: `currentStreak(dates, todayKey)` returns N when today and N-1 prior consecutive days are all in `dates`
- [x] R6: `longestStreak(dates)` returns 0 for empty input
- [x] R7: `longestStreak(dates)` returns the longest consecutive run anywhere in history
- [x] R8: `computeStreaks(dates, todayKey)` returns `{ current, longest }` and `longest >= current` always
- [x] R9: Both functions ignore duplicate date keys (defensive — should not occur given storage idempotency)
- [x] R10: Both functions ignore future-dated entries relative to `todayKey` (defensive)

## UI components
- [x] R11: `<StreakBadge />` accepts `{ current, longest }` and renders:
  - "No streak yet" when both are 0
  - Otherwise a 🔥 + current with a smaller "Best N" line beneath
- [x] R12: `<StreakBadge />` uses lucide `Flame` icon (not emoji) to stay on-stack
- [x] R13: `<HabitCard />` reads `completions[habit.id] ?? []`, calls `computeStreaks`, passes summary to `<StreakBadge />`
- [x] R14: `<HabitCard />` layout updated so the streak block sits right of the name, the three-dot menu stays accessible (top-right corner of card)
- [x] R15: Card layout remains responsive at 375px / 768px / 1280px — name truncates, streak block does not wrap awkwardly

## Page wiring
- [x] R16: `app/page.tsx` computes `todayKey()` once per render and passes it as a prop to each `<HabitCard />` (avoids per-card recomputation and keeps "today" coherent across the page)
- [x] R17: `<HabitCard />` accepts `todayKey: DateKey` as a prop

## Behavior
- [x] R18: Marking a habit done today increases the displayed current streak by 1 (and longest if applicable)
- [x] R19: Un-marking a habit today drops current to 0; longest recomputes from the remaining data (no separate high-water mark — keeps "honest history")
- [x] R20: Streak survives refresh (read from existing `completions` storage)

## Non-functional
- [x] R21: No `any` types
- [x] R22: No console errors or React key warnings
- [x] R23: All Phase 1 + Phase 2 validations still pass (no regression)
- [x] R24: New unit tests in `tests/app.test.tsx` cover: empty, single-day, multi-day, gap-breaks-streak, today-not-checked-returns-0, longest-preserved-after-break, future-date-defended
