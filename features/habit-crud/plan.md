# Plan — Habit CRUD (Phase 1)

## Goal
A user can create, view, edit, and delete habits, with all data surviving a page refresh.

## User stories
- As a user, I can click a "New habit" button to open a dialog and create a habit with a name, an icon, and a color.
- As a user, I can see all my habits as cards on the home page.
- As a user, I can open a card's three-dot menu to edit or delete a habit.
- As a user, I am asked to confirm before a habit is deleted (so I don't lose data accidentally).
- As a user, my habits persist across page refreshes (no cloud, just local).

## Architecture sketch

```
app/
  page.tsx                      Home — lists habits, hosts dialog
  layout.tsx                    Root layout (already exists)

components/
  HabitCard.tsx                 One habit's visual + three-dot menu trigger
  HabitFormDialog.tsx           Modal for create/edit (controlled by parent)
  HabitMenu.tsx                 Three-dot dropdown (Edit / Delete)
  ConfirmDialog.tsx             Reusable confirm-before-action modal
  IconPicker.tsx                Grid of curated lucide icons
  ColorPicker.tsx               8-swatch palette

lib/
  types.ts                      Habit, HabitColor, HabitIconName, options arrays
  storage.ts                    Single boundary for localStorage I/O
  ids.ts                        crypto.randomUUID() wrapper for testability

hooks/
  useHabits.ts                  Reads from storage, exposes CRUD + state
```

## Data model

```ts
// lib/types.ts
export type HabitColor =
  | 'red' | 'orange' | 'amber' | 'green'
  | 'teal' | 'blue' | 'purple' | 'pink';

export type HabitIconName =
  | 'Book' | 'Dumbbell' | 'Droplet' | 'Brain'
  | 'Coffee' | 'Bed' | 'Heart' | 'Leaf'
  | 'Music' | 'Pencil' | 'Sun' | 'Moon'
  // ...curated ~30 lucide icon names
  ;

export interface Habit {
  id: string;             // uuid
  name: string;           // 1–40 chars, trimmed
  iconName: HabitIconName;
  color: HabitColor;
  createdAt: string;      // ISO timestamp
}
```

Storage shape in `localStorage`:
```json
{ "habit-flow:v1": { "habits": [ { ...Habit }, ... ] } }
```

## Decisions confirmed with user
- **Color**: fixed 8-swatch palette (Q1.a)
- **Icon source**: curated ~30 `lucide-react` icons, NOT emoji (Q2 — lighter than emoji-picker library, already in stack)
- **Add UI**: modal dialog (Q3.a)
- **Edit/Delete**: three-dot menu on card (Q4.b)

## Out of scope (this PR)
- Daily check-in / marking done (that's Phase 2)
- Streaks, history, charts (Phases 3–6)
- Categories (Phase 5)
- Drag-to-reorder habits
- Server sync, auth
- Form validation beyond "name not empty" + length cap
