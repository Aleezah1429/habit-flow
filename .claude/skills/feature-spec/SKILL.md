---
name: feature-spec
description: Scaffold the three spec files (plan, requirements, validations) for a new feature in HabitFlow. Use when the user picks a phase from specs/roadmap.md and is ready to design before coding. Invoke with the feature name as argument, e.g. /feature-spec habit-crud.
---

# feature-spec

Spec-driven development Step 2: turn a roadmap phase into three concrete planning docs **before** writing any code.

## When to use

The user has picked the next phase from `specs/roadmap.md` (Step 1) and asked to "spec out" or "plan" the feature. **Do not start coding** in this skill — the goal is to think on paper first.

## What to create

For a feature called `<feature-name>`, create the folder `features/<feature-name>/` with three files:

### 1. `plan.md` — *the design doc*
- **Goal**: one-sentence outcome the user will see
- **User stories**: 3–6 bullets in "As a user, I can…" form
- **Architecture sketch**: which components, hooks, lib functions, routes
- **Data model**: TypeScript types/interfaces this feature touches
- **Out of scope**: explicit list of what this PR will NOT do (prevents scope creep)

### 2. `requirements.md` — *the must-haves*
A numbered checklist (`[ ]`) of every concrete deliverable. Must be granular enough that ticking them all = feature done. Example:
```
- [ ] R1: `Habit` type defined in `lib/types.ts`
- [ ] R2: `addHabit(name, icon, color)` function in `lib/storage.ts`
- [ ] R3: `<HabitForm />` component with controlled inputs
```

### 3. `validations.md` — *how we'll know it works*
Acceptance tests in plain English, written from the **user's** perspective. Each one must be observable in the UI or with `localStorage` inspection. Example:
```
- [ ] V1: Click "Add habit", fill name "Read", pick book emoji, save → habit appears in list
- [ ] V2: Refresh the page → habit is still there
- [ ] V3: Try to save with empty name → form shows error, nothing saved
```

## Process

1. **Read** `specs/mission.md`, `specs/tech.md`, `specs/roadmap.md` first — never spec a feature without re-grounding in the mission.
2. **Confirm the phase** with the user before writing files. Quote the exact roadmap section you're addressing.
3. **Ask 2–4 clarifying questions** about UX/scope (e.g. "Should colors be a fixed palette or free-pick?"). Don't ask more than 4 — you'll annoy the user.
4. **Write the three files** in `features/<feature-name>/`.
5. **Stop**. Show the user the file paths and ask permission to proceed to Step 3 (implementation).

## Tech rules to honor (from specs/tech.md)

- Stack: Next.js 15 App Router · TypeScript strict · Tailwind · localStorage · date-fns
- All localStorage access goes through `lib/storage.ts`
- All date math goes through `lib/date.ts`
- No `any` type
- Tests in `tests/`, not co-located

## Output style

- Use markdown checklists `- [ ]` so progress can be ticked.
- Keep each file under 100 lines — if it's longer, the feature is too big, split into two phases.
- No code in spec files. Pseudo-types are okay.
