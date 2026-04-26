# Plan — Daily Check-in (Phase 2)

## Goal
A user can mark each habit "done today" with one click on a dedicated check button, see the card visually flip to a "completed" state, un-mark it if needed, and have today's date shown prominently — with all of today's check-ins surviving a refresh.

## User stories
- As a user, I see today's date at the top of the home page so the page feels grounded in "right now".
- As a user, I can click the round check button on a habit card to mark it done for today.
- As a user, I can click that same button again to un-mark (mistake recovery).
- As a user, I can see at a glance which habits I've already done today (filled color + check overlay) vs. which are still pending (outlined).
- As a user, my today-state is preserved across page refreshes.
- As a user, when the date changes (next day), all cards reset to the unchecked visual — yesterday's history is preserved in storage but not shown.

## Architecture sketch

```
app/
  page.tsx                      Home — adds <TodayHeader /> above grid; passes today's date down

components/
  HabitCard.tsx                 Adds checked-state styling; renders <CheckButton />
  CheckButton.tsx               NEW — round button, controlled, click = onToggle()
  TodayHeader.tsx               NEW — "Sunday, April 26" big heading

lib/
  date.ts                       NEW — `todayKey()` → 'YYYY-MM-DD' local;
                                       `formatToday(date)` → 'Sunday, April 26'
  storage.ts                    Extends shape with `completions`;
                                  adds `getCompletions()`, `markDone(habitId, date)`,
                                  `unmarkDone(habitId, date)`, `isDone(habitId, date)`
  types.ts                      Adds `Completions` type, updates `StoredV1` shape

hooks/
  useHabits.ts                  Extends with `completions`, `toggleToday(habitId)`,
                                  `isDoneToday(habitId)`
```

## Data model

```ts
// lib/types.ts (additions)
export type DateKey = string;  // 'YYYY-MM-DD' in local timezone

export type Completions = Record<string /*habitId*/, DateKey[]>;

export interface StoredV1 {
  habits: Habit[];
  completions: Completions;   // NEW in Phase 2
}
```

Storage shape in `localStorage` after Phase 2:
```json
{
  "habit-flow:v1": {
    "habits": [ { "id": "...", ... } ],
    "completions": { "<habitId>": ["2026-04-25", "2026-04-26"] }
  }
}
```

## Decisions confirmed with user
- **Toggle UX**: dedicated round CheckButton on each card (not whole-card click).
- **Done visual**: card fills with light tint of habit color + a check icon overlay.
- **Date display**: large heading at top of home page, format `"Sunday, April 26"` (year omitted).
- **Storage shape**: top-level `completions: { [habitId]: DateKey[] }` map alongside `habits`.

## Out of scope (this PR)
- Streak calculation (current / longest) — Phase 3
- Heatmap / past-day backfill — Phase 4
- Categories, filters, stats — Phases 5–6
- Reminders / notifications — backlog
- Auto-rollover at midnight without refresh (acceptable: page recomputes today on each render; if the tab is left open across midnight, a refresh resets cards)
- Migration of existing localStorage data without `completions` (handled defensively in `getCompletions()` returning `{}` when missing)
