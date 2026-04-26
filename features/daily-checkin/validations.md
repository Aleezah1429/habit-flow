# Validations — Daily Check-in (Phase 2)

> Each is a manual acceptance test. Tick `[x]` only after observing the behavior in a real browser. These map to test cases in `tests/app.test.tsx`.

## Today header
- [ ] V1: Top of home page shows today's date, e.g. `"Sunday, April 26"` (weekday + month + day, no year)
- [ ] V2: Heading is visually larger than habit names (clearly the page heading)
- [ ] V3: Date string matches the device's local date (not UTC) — verified by changing system timezone or checking against a clock

## Mark done
- [ ] V4: Click the round check button on a card → button fills with habit color, check icon appears
- [ ] V5: Card body changes to a light tint of the habit color and a small check overlay shows near the habit icon
- [ ] V6: Clicking the check button does NOT open the three-dot menu or the edit dialog
- [ ] V7: Clicking elsewhere on the card body does NOT toggle the check state

## Un-mark (mistake recovery)
- [ ] V8: With a card already done, click the round check button again → reverts to outlined / unchecked visual
- [ ] V9: Card body returns to its original (Phase 1) appearance

## Multiple habits independent
- [ ] V10: With 3 habits, mark the middle one done → only that card changes; the other two remain unchecked

## Persistence
- [ ] V11: Mark 2 of 3 habits done → refresh page (Cmd+R) → same 2 still showing as done
- [ ] V12: Un-mark a habit → refresh → it remains unchecked
- [ ] V13: Open DevTools → Application → Local Storage → `habit-flow:v1` JSON contains a `completions` object with today's date under the marked habit IDs only

## Habit deletion cleanup
- [ ] V14: Mark habit A done → delete habit A → inspect storage → `completions[A]` is gone (no orphan history)

## Date rollover (manual)
- [ ] V15: Mark a habit done → change device date forward by one day → refresh → card shows unchecked (yesterday's record is in storage but today's bucket is empty)
- [ ] V16: Change device date back to original → refresh → card is checked again (history preserved)

## Resilience
- [ ] V17: Open old localStorage with `habits` but no `completions` key → app loads without crash, all cards unchecked
- [ ] V18: Manually corrupt `completions` to `"garbage"` in DevTools → refresh → app loads with empty completions, no white screen

## A11y / UX guardrails
- [ ] V19: Tab to a check button → press Space → it toggles
- [ ] V20: Check button has `aria-checked` reflecting state and a sensible accessible name (e.g. `"Mark Read 20 mins as done today"`)
- [ ] V21: No console errors during any of the above flows
- [ ] V22: Responsive — on 375px / 768px / 1280px the date heading and check buttons remain comfortably tappable and readable
