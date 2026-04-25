# Validations — Habit CRUD (Phase 1)

> Each is a manual acceptance test. Tick `[x]` only after observing the behavior in a real browser. These map to test cases in `tests/app.test.tsx`.

## Create
- [ ] V1: Click "New habit" → dialog opens with name input focused
- [ ] V2: Fill name "Read 20 mins", pick book icon, pick blue color, click Save → dialog closes, new card appears in the grid
- [ ] V3: Default state when dialog opens: first icon highlighted, first color highlighted, name empty
- [ ] V4: Save button is disabled while name is empty
- [ ] V5: Try to type a 41st character → input refuses (maxLength stops it)

## Read / List
- [ ] V6: Each card shows the chosen icon, the habit name, and a color accent matching the chosen color
- [ ] V7: Cards are arranged in a grid (1 col on mobile, 2 on tablet, 3 on desktop) — verified by resizing browser
- [ ] V8: With zero habits, an empty state is visible ("No habits yet — click New habit to start")

## Edit
- [ ] V9: Open card's three-dot menu → click "Edit" → dialog opens pre-filled with that habit's name, icon, color
- [ ] V10: Change the name, click Save → card on home page reflects new name immediately
- [ ] V11: Open Edit dialog, change nothing, click Cancel → no change to the card

## Delete
- [ ] V12: Open three-dot menu → click "Delete" → confirm dialog appears asking "Delete '<name>'? This cannot be undone."
- [ ] V13: Click Cancel on confirm → dialog closes, habit still on grid
- [ ] V14: Click Confirm on confirm → dialog closes, habit removed from grid

## Persistence
- [ ] V15: Add 3 habits → refresh page (Cmd+R) → all 3 still visible in same order
- [ ] V16: Edit a habit's name → refresh → new name persists
- [ ] V17: Delete a habit → refresh → it stays deleted
- [ ] V18: Open DevTools → Application → Local Storage → key `habit-flow:v1` exists with valid JSON

## Resilience
- [ ] V19: Manually corrupt the localStorage value (set it to "garbage") → refresh → app loads with empty state, no white screen
- [ ] V20: Delete the localStorage key entirely → refresh → app loads with empty state

## A11y / UX guardrails
- [ ] V21: All interactive elements reachable by Tab key
- [ ] V22: Esc closes any open dialog
- [ ] V23: No console errors or warnings during any of the above flows
