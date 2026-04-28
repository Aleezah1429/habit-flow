# Plan — Streaks (Phase 3)

## Goal
A user sees, on every habit card, both the **current streak** (consecutive days ending today, only counted when today is done) and the **longest-ever streak**, so they can feel momentum and see their personal best.

## User stories
- As a user, after marking a habit done today, I see "🔥 N day streak" appear on the card.
- As a user, marking the habit done seven days in a row shows "🔥 7 day streak".
- As a user, if I miss a day, my current streak resets — but my "Best" stays as the high-water mark.
- As a user, if I haven't checked today yet, my current streak shows 0 (the day isn't earned until I actually check it).
- As a user, a brand-new habit with no check-ins shows "No streak yet" instead of "0 days".

## Architecture sketch

```
lib/
  streak.ts                NEW — pure functions:
                              currentStreak(dates, todayKey) → number
                              longestStreak(dates) → number
                              computeStreaks(dates, todayKey) → { current, longest }
  date.ts                  Add `previousDay(dateKey)` helper (string→string, local-tz safe)

components/
  HabitCard.tsx            Layout updated: right column shows streak block; three-dot menu stays at top-right
  StreakBadge.tsx          NEW — small visual: 🔥 + number + label; or "No streak yet" empty state

hooks/
  useHabits.ts             No change to API; consumers read `completions[id]` directly and pass to streak.ts

app/
  page.tsx                 Passes today's key down so cards don't each call `todayKey()` (single source of truth per render)
```

## Data model

No new persisted shape. Streaks are **derived** from the existing `Completions` map.

```ts
// lib/streak.ts
export interface StreakSummary {
  current: number;   // 0 if today not in dates; else consecutive days ending today
  longest: number;   // max consecutive run anywhere in history; ≥ current
}

export function computeStreaks(
  dates: DateKey[],
  todayKey: DateKey,
): StreakSummary;
```

Algorithm:
- **current**: if `dates` doesn't include `todayKey`, return 0. Else walk back day-by-day from today using `previousDay()`, counting while each step is in the date set, stop at the first gap.
- **longest**: sort the unique dates ascending; do a single pass tracking the running streak; return the max. Future-dated entries (defensive) are filtered out.

## Decisions confirmed with user
- **Current streak when today is unchecked** = 0 (today must be earned). No "pending today" badge.
- **Card layout** = right-aligned streak column; three-dot menu repositioned to top-right corner.
- **Empty state** = "No streak yet" until the first check-in; after that show numbers always (even when current = 0 and longest > 0).
- **Compute strategy** = pure function, recompute on render. `useMemo` per card if profiling later shows a problem.

## Out of scope (this PR)
- Heatmap / past-day backfill — Phase 4 (so we can't yet "fix yesterday" to revive a broken streak).
- Streak milestones / celebrations (e.g. confetti at 7-day) — backlog polish.
- "Streak freeze" or grace days — not aligned with mission's *honest history* value.
- Across-habit aggregate streak (e.g. "did anything today, day 30") — Phase 6 stats.
- Caching/memoization of streak values to localStorage — premature.
