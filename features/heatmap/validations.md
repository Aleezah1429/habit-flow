# Validations — History heatmap (Phase 4)

> Each is a manual acceptance test. Tick `[x]` only after observing in a real browser.

## Expansion
- [ ] V1: A habit card has a chevron-right (or down) button on its right side; clicking it expands the card and reveals a heatmap underneath
- [ ] V2: Clicking the chevron again collapses the heatmap; the card returns to its compact form
- [ ] V3: Expanding card A does not expand card B — each card's state is independent

## Heatmap layout
- [ ] V4: The grid has exactly 12 columns × 7 rows (84 cells) — verified by counting in DevTools
- [ ] V5: Each column represents one week, Monday at the top row, Sunday at the bottom
- [ ] V6: The rightmost column contains today, and today's cell is in the row matching today's weekday
- [ ] V7: At small viewports (375px), the heatmap remains readable — cells may be smaller but the grid stays 12×7 without wrap

## Visual states
- [ ] V8: Cells whose date is "done" display the habit's color tint
- [ ] V9: Cells whose date is "not done" display a neutral light gray (or `bg-zinc-100` / dark equivalent)
- [ ] V10: Cells in the future (after today) appear faded/striped; their cursor is `not-allowed`; clicking them does nothing
- [ ] V11: Today's cell is visually distinguishable when not done (e.g. a thin ring) so users can find it

## Tooltip
- [ ] V12: Hovering any past or today cell shows a native browser tooltip in the format `"Mon, Apr 21 — done"` or `"Tue, Apr 22 — not done"`
- [ ] V13: After toggling a cell, the tooltip text updates the next time you hover

## Click to toggle
- [ ] V14: Click a not-done past cell → cell fills with habit color; storage `completions[habitId]` now includes that date (verify in DevTools)
- [ ] V15: Click a done past cell → cell goes neutral; that date is removed from `completions[habitId]`
- [ ] V16: Click today's cell → state flips; the round CheckButton at the top of the card stays in sync (both reflect today's truth)
- [ ] V17: Click a future cell → nothing happens; storage unchanged

## Streak coherence
- [ ] V18: Backfilling yesterday by clicking its cell while today is already done → streak badge updates from `1 day · Best 1` to `2 days · Best 2`
- [ ] V19: Removing a past day that bridged two streaks → streak badge recomputes correctly

## Persistence
- [ ] V20: Click any 5 past cells to fill them → refresh → those 5 cells remain filled
- [ ] V21: DevTools → Application → Local Storage → `habit-flow:v1` `completions[habitId]` matches exactly the dates that appear filled

## A11y / UX guardrails
- [ ] V22: Tab key moves focus through cells; Enter/Space toggles the focused cell
- [ ] V23: Each cell button has an accessible name combining date + status
- [ ] V24: Future cells have `aria-disabled="true"` (verified in DevTools)
- [ ] V25: No console errors during any of the above
