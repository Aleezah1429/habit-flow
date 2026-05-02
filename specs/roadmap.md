# Roadmap — HabitFlow

> Each phase = one mergeable PR. Tick `[x]` when shipped.
> Status legend: `[ ]` pending · `[~]` in progress · `[x]` done

---

## Phase 1 — Habit CRUD (the foundation) ✅

- Add a habit (name + lucide icon + color)
- List all habits on home page
- Edit habit name/icon/color
- Delete a habit (with confirm)
- Persist to `localStorage`

**Definition of done**: User can refresh the page and habits are still there.

---

## Phase 2 — Daily check-in ✅

- Mark a habit "done today" with one click
- Visual state: checked vs unchecked
- Un-mark (mistake recovery)
- Show today's date prominently

**Definition of done**: One-click logging works; refresh preserves today's state.

---

## Phase 3 — Streaks ✅

- Calculate current streak per habit (consecutive days done)
- Calculate longest-ever streak
- Display both on each habit card
- Streak breaks correctly when a day is skipped

**Definition of done**: Manually setting 7 days done → shows "7 day streak".

---

## Phase 4 — History heatmap ✅

- 12-week heatmap per habit (GitHub-contributions style)
- Click any cell to toggle that day's status
- Hover shows date + status

**Definition of done**: Heatmap matches stored data; backfilling past days works.

---

## Phase 5 — Categories & filters

- Tag a habit with a category (Health, Mind, Work, …)
- Filter home view by category
- Show category color accent on cards

**Definition of done**: Filtering by category hides/shows correct habits.

---

## Phase 6 — Stats dashboard

- `/stats` page
- Weekly completion % per habit (bar chart via recharts)
- Best/worst day of the week per habit
- Total habits-completed-ever counter

**Definition of done**: Stats numbers match what heatmap shows.

---

## Phase 7 — Polish & ship

- Empty states (no habits yet)
- Dark mode toggle
- Keyboard shortcuts (`n` = new habit, `1-9` = toggle Nth habit)
- Export/import data as JSON

**Definition of done**: App feels finished — no rough edges, no console errors.

---

## Backlog (post-v1, no commitments)

- Reminders via browser notifications
- Supabase migration for multi-device sync
- Habit templates ("Atomic Habits starter pack")
- Sharing public profile

