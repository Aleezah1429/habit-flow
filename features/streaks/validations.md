# Validations — Streaks (Phase 3)

> Each is a manual acceptance test. Tick `[x]` only after observing in a real browser.

## Empty state
- [ ] V1: A brand-new habit (just created, never checked) shows "No streak yet" on the card — no flame icon, no numbers
- [ ] V2: As soon as the user clicks the check button for the first time, "No streak yet" disappears and "🔥 1 day · Best 1" appears

## Counting up
- [ ] V3: With a habit checked for today only, card shows "🔥 1 day · Best 1"
- [ ] V4: Manually inserting `["2026-04-25", "2026-04-26"]` into `completions[habitId]` (today=2026-04-26) → card shows "🔥 2 days · Best 2" after refresh
- [ ] V5: Manually inserting 7 consecutive days ending today → card shows "🔥 7 day streak · Best 7" — matches the roadmap "definition of done"

## Today must be earned
- [ ] V6: A habit done yesterday but NOT today shows "🔥 0" / "Best ≥1" — current is 0 because today isn't checked
- [ ] V7: Clicking today's check button on V6's habit flips current to "≥2" (yesterday + today) instantly

## Un-marking
- [ ] V8: With current = 5 (today + 4 prior consecutive), unmark today → current drops to 0, "Best 4" shown (the 4-day prefix that remains)
- [ ] V9: Click again to re-mark today → current returns to 5, "Best 5"

## Gaps reset
- [ ] V10: Manually inserting `["2026-04-20", "2026-04-21", "2026-04-22"]` (gap before today=2026-04-26) → current = 0, longest = 3
- [ ] V11: Manually inserting `["2026-04-20", "2026-04-21", "2026-04-26"]` → current = 1 (just today), longest = 2

## Longest reflects current data (honest history)
- [ ] V12: With dates `["2026-04-10"..."2026-04-14"]` (5 consecutive, ending 12 days ago) and today checked → current = 1, "Best 5" — the older 5-day run wins because it's still the longest run in the data

## Layout / responsive
- [ ] V13: Card layout at 375px (mobile) — name truncates with ellipsis if long, streak block does not push the three-dot menu off-screen
- [ ] V14: Card layout at 768px (tablet) and 1280px (desktop) — streak block sits cleanly to the right of the name; three-dot menu remains in the top-right corner
- [ ] V15: Long habit name (e.g. "Read 20 mins of nonfiction") + 3-digit streak (force via DevTools) still fits without overflow

## Persistence
- [ ] V16: Refresh the page → all displayed streaks match the storage data exactly
- [ ] V17: Open DevTools → Application → Local Storage → manually edit `completions[habitId]` to add/remove dates → refresh → streaks recompute correctly

## A11y / UX guardrails
- [ ] V18: Streak block has a sensible accessible name (e.g. `aria-label="5 day current streak, best 7"`) so screen readers announce useful info
- [ ] V19: No console errors or React warnings during any of the above
- [ ] V20: All Phase 1 (CRUD) and Phase 2 (check-in) validations still hold
