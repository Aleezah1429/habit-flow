# Plan — History heatmap (Phase 4)

## Goal
A user can expand any habit card to reveal a 12-week heatmap of their history (Monday-start columns × 7 weekday rows), and click any past or today cell to toggle that day's status — backfilling missed days or correcting mistakes.

## User stories
- As a user, I can click a chevron on a habit card to expand it and see the last 12 weeks of my history at a glance.
- As a user, I can hover (or long-press on mobile) a cell to see the date and status, e.g. *"Mon, Apr 21 — done"*.
- As a user, I can click any cell from any past day or today to flip its status — letting me backfill the day I forgot to log or undo a mistake.
- As a user, future cells are visibly disabled — I can't pre-mark tomorrow.
- As a user, a cell that's "done" is a solid tint of the habit color; "not done" is a light neutral; the result reads as a quick visual heatbar.
- As a user, my changes via the heatmap survive a refresh — same `localStorage` data as one-click check-in.

## Architecture sketch

```
lib/
  date.ts                  Add helpers:
                              mondayOfWeek(dateKey) → DateKey
                              addDays(dateKey, n) → DateKey
                              buildHeatmapGrid(todayKey, weeks=12) → DateKey[][]   (cols × rows)
                              formatHeatmapTitle(dateKey, done) → "Mon, Apr 21 — done"

components/
  HabitCard.tsx            Adds an expand/collapse chevron; renders <Heatmap /> when expanded
  Heatmap.tsx              NEW — receives { dates, todayKey, color, onToggle }; renders 12×7 grid
  HeatmapCell.tsx          NEW (or inline) — one cell, button when ≤ today, span when future

hooks/
  useHabits.ts             Adds toggleDate(habitId, dateKey); keep toggleToday as a wrapper

app/
  page.tsx                 No change — completions are already passed to <HabitCard />
```

## Data model

No new persisted shape. Heatmap reads the same `Completions` map and writes via the existing `markDone` / `unmarkDone` storage helpers (which already accept any `DateKey`).

```ts
// New in lib/date.ts
export function buildHeatmapGrid(todayKey: DateKey, weeks?: number): DateKey[][];
//   returns weeks columns × 7 rows, Monday-start; rightmost column contains today

// New in hooks/useHabits.ts
toggleDate: (habitId: string, dateKey: DateKey) => void;
```

## Decisions confirmed with user
- **Placement**: expandable inside each card (no new routes, no modals).
- **Week orientation**: Monday-start. Columns = weeks (oldest → today). Rows = Mon, Tue, …, Sun.
- **Click semantics**: all cells from `gridStart` through `today` are toggleable; cells *after today* are disabled (visibly faded, `aria-disabled`, no click handler).
- **Tooltip**: native browser `title` attribute. No custom tooltip component.

## Out of scope (this PR)
- Per-day annotations or notes — backlog.
- "Streak break" visualisation overlay (e.g. red diagonals where a streak broke) — Phase 6 stats territory.
- Configurable heatmap range (12 weeks is fixed for v1).
- Year-long heatmap or multi-year history scrolling.
- Full-bleed standalone heatmap page or modal — placement is inside the card by design choice.
- Dragging across cells to bulk-toggle — single-click only for now.
