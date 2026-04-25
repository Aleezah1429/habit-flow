---
name: release-phase
description: Close out a completed phase — tick roadmap, add CHANGELOG entry, merge feature branch to main, delete branch. Use when implementation + tests for a phase are done and the user is ready to ship. Invoke with the phase name, e.g. /release-phase phase-1-habit-crud.
---

# release-phase

Spec-driven Step 6: cleanly land a finished phase on `main` and document it. Catches the common "I forgot to merge" mistake.

## When to use

The user has:
- Finished implementation (Step 3) ✅
- Written tests (Step 4) ✅
- (Maybe) polished responsive UI (Step 5) ✅
- And says "let's ship", "merge it", "release", or "step 6".

**Do not run** if tests are failing or roadmap items are unticked — fix those first.

## Pre-flight checks (must all pass)

1. `npm run test:run` exits 0
2. `npx tsc --noEmit` exits 0
3. The phase's row in `specs/roadmap.md` is fully ticked
4. The matching `features/<feature>/requirements.md` is fully ticked
5. Working tree is clean (`git status --short` empty)

If any fail → stop and tell the user what to fix. Do not proceed.

## Process

1. **Find the phase number + title** from `specs/roadmap.md` (the most recently completed `[x]` block).
2. **Add a CHANGELOG.md entry** at the top under a new `## [vX.Y.0] — YYYY-MM-DD` heading. Sections: `### Added`, `### Changed`, `### Fixed`. Pull bullets from the phase's commit messages (`git log main..feature/<name> --oneline`).
3. **Commit the changelog** on the feature branch: `chore: changelog for vX.Y.0`.
4. **Switch to main** and **fast-forward merge** the feature branch:
   ```
   git checkout main
   git merge feature/<name> --ff-only
   ```
   If `--ff-only` fails, the branch has diverged — tell the user and ask whether to rebase or merge-commit.
5. **Tag the release** (optional but nice): `git tag vX.Y.0`.
6. **Ask the user** before deleting the branch: "Delete `feature/<name>`? (y/N)". Only delete if they say yes.
7. **Stop**. Show:
   - The new `main` HEAD commit
   - The CHANGELOG entry just added
   - The phase the user is now eligible to start (from `roadmap.md`)

## Versioning rule (HabitFlow)

- Each completed roadmap phase = **minor bump** (Phase 1 → v0.1.0, Phase 2 → v0.2.0).
- Patch fixes shipped to `main` between phases = **patch bump** (v0.1.1).
- v1.0.0 = the day Phase 7 (Polish & ship) is done.

## What this skill does NOT do

- Push to remote (no remote exists in v1; if added later, user must push manually).
- Open PRs (single-dev project; merge happens locally).
- Run lint or build — too slow for routine; user runs separately if needed.
