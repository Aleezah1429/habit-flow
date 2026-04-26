# Spec-Driven Development Workflow

> Personal reference for how this project is built. **Read this first** every time you start a new phase. It captures the discipline + shortcuts so you don't have to re-think the process.

---

## The 7 Steps (per phase)

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 0  →  Project specs  (only ONCE per project)             │
│  ────────────────────────────────────────────────────────────   │
│  Step 1  →  Pick next phase + branch + ask questions           │
│  Step 2  →  Per-feature spec docs (plan, requirements, valid.) │
│  Step 3  →  Implement + tick requirements + roadmap            │
│  Step 4  →  Tests (Vitest + RTL)                                │
│  Step 5  →  Responsive UI audit                                 │
│  Step 6  →  Changelog + merge to main + tag release             │
│  Step 7  →  Update README + todo.md                             │
└─────────────────────────────────────────────────────────────────┘
```

| Step | What you produce | Skill / shortcut |
|---|---|---|
| **0** | `specs/mission.md` · `specs/tech.md` · `specs/roadmap.md` | one-time setup |
| **1** | A new branch `feature/phase-N-<name>` + answers to design questions | manual |
| **2** | `features/<name>/plan.md` · `requirements.md` · `validations.md` | **`/feature-spec <name>`** |
| **3** | Working code + ticked checkboxes in `requirements.md` and `roadmap.md` | manual |
| **4** | Tests in `tests/app.test.tsx` (storage + critical user flows) | manual |
| **5** | Mobile/tablet/desktop verified in DevTools responsive mode | manual |
| **6** | `CHANGELOG.md` entry + merged to `main` + git tag | **`/release-phase <name>`** |
| **7** | `README.md` + `todo.md` updated | manual |

---

## Cheat Sheet — *every phase, in order*

```bash
# ── STEP 1: branch from clean main ──────────────────────────
git checkout main
git pull
git checkout -b feature/phase-N-<short-name>

# ── STEP 2: spec the feature (in Claude Code) ───────────────
/feature-spec <short-name>
# → answer 2-4 design questions
# → 3 markdown files appear in features/<short-name>/

# ── STEP 3: implement ───────────────────────────────────────
# Work down the list in features/<short-name>/requirements.md
# Tick [x] each item as you ship it.
# Tick the phase rows in specs/roadmap.md too.

# ── STEP 4: tests ───────────────────────────────────────────
# Add tests to tests/app.test.tsx
# Storage layer first (pure functions = high value, easy)
# Then 2-3 critical user flows
npm run test:run    # must exit 0

# ── STEP 5: responsive audit (browser) ──────────────────────
# Cmd+Shift+M in Chrome → check 375px, 768px, 1280px

# ── STEP 6: ship ─────────────────────────────────────────────
/release-phase phase-N-<short-name>
# → tests run, CHANGELOG written, merged to main, tagged vX.Y.0
git push origin main
git push origin vX.Y.0

# ── STEP 7: docs ─────────────────────────────────────────────
# Update README.md roadmap section
# Update todo.md with new "Up next" ideas for Phase N+1
git add -A && git commit -m "docs: post-vX.Y.0 housekeeping"
git push
```

---

## Skills Available (in `.claude/skills/`)

| Skill | When to invoke | What it does |
|---|---|---|
| **`/feature-spec <name>`** | After Step 1, before any code | Reads `specs/*`, asks 2-4 design questions, writes the 3 spec files in `features/<name>/`. Stops before coding. |
| **`/release-phase <name>`** | After Step 5, when ready to ship | Pre-flight checks (tests pass, roadmap ticked, tree clean), writes `CHANGELOG.md` entry, fast-forward merges to `main`, creates git tag `vX.Y.0`, asks before deleting branch. |

If a workflow repeats 3+ times manually → **make it a new skill**. (See "Pain → Skill" below.)

---

## Decision Guide — *common questions*

### "Bug mila — kya `validations.md` ya `requirements.md` change karoon?"

| Scenario | Change spec? |
|---|---|
| 🐛 Implementation bug | ❌ No — just fix the code |
| 🎨 Cosmetic / styling polish | ❌ No |
| ✨ New requirement discovered | ✅ Yes — add to `requirements.md` or new phase |
| 🧪 Validation gap revealed | ✅ Optional — add to `validations.md` to prevent regression |

### "Kya test karoon, kya skip karoon?"

| ✅ Test | ❌ Skip |
|---|---|
| Pure functions (lib/) | Pure styling (color sahi laga ya nahi) |
| Storage / persistence layer | Third-party rendering (e.g. lucide icons) |
| Critical user flows (create, delete, etc.) | Browser-native behaviors (`<dialog>` open/close) |
| Edge cases (corrupt JSON, empty input) | Tailwind class names |

### "Library add karoon ya useState se kaam chal jayega?"

> **Don't reach for state library until you feel the pain.**

- 1 component me state → `useState`
- 2-3 components, prop drilling 1-2 levels deep → lift state up or pass props
- Many components, multiple pages share state → **then** Zustand / Jotai

For HabitFlow: Zustand reserved for Phase 6 (`/stats` page).

---

## Lessons Learned (from Phase 1)

### 1. **"Pehle thinking, phir typing"**
Specs (Step 0 + 2) take time but **save 10x more time** in Step 3. Code without a plan = refactor hell.

### 2. **"Pain → Skill" pattern**
Every time you make a mistake you'd repeat (e.g. *"forgot to merge"*), turn the fix into a skill. Future-you will thank present-you. Example: `release-phase` was born from the merge-bhool-gayi moment.

### 3. **Spec ≠ Implementation**
`requirements.md` says **WHAT** must exist (developer-side). `validations.md` says **HOW user knows it works** (UX-side). Same feature, two angles.

### 4. **Single boundary for side effects**
All `localStorage` access lives in `lib/storage.ts`. **One file** to refactor when we move to Supabase. **One file** to mock in tests. *(Same rule for date math — `lib/date.ts` when we add it.)*

### 5. **RTL queries = role + name, never CSS class**
```tsx
screen.getByRole('button', { name: /new habit/i })  // ✅ refactor-safe
document.querySelector('.btn-primary')              // ❌ breaks on rename
```

### 6. **Tailwind v4 + native `<dialog>` = needs `m-auto`**
Preflight resets `margin: 0`, killing the browser's auto-centering. Always include `m-auto` on `<dialog>` className.

### 7. **jsdom doesn't know `dialog.showModal()`**
Polyfill in `tests/setup.ts`:
```ts
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
```

### 8. **GitHub default branch trap**
Agar GitHub repo banate waqt feature branch active thi → woh **default ban jaati hai**. PR direction reverse ho jaati. Fix: `Settings → Branches → Default branch → main`.

---

## Common Mistakes (red flags — STOP if you notice)

| 🚩 Symptom | 🩹 What to do |
|---|---|
| Writing code without `requirements.md` for the feature | Stop. Run `/feature-spec` first. |
| Adding 4+ items to one phase's checklist | Phase too big — split into two. |
| Tests passing but the actual feature is broken in the browser | You're testing implementation, not behavior. Rewrite tests. |
| `[ ]` items in `requirements.md` while you call the phase "done" | Tick them or admit they're not done. |
| `git status` shows files you don't recognize | Investigate before staging — could be uncommitted work. |
| Pushing to `main` without `npm run test:run` | Don't. Add a pre-push hook if you can't trust yourself. |

---

## File Map (quick "kahan kya hai")

```
specs/                    # Project-level — change rarely
  mission.md              # Why we exist
  tech.md                 # Stack, conventions, hard rules
  roadmap.md              # All phases, ticked as shipped

features/<name>/          # Per-phase — created in Step 2
  plan.md                 # Design (goal, stories, architecture)
  requirements.md         # Engineer's checklist (R1, R2, ...)
  validations.md          # User-side acceptance tests (V1, V2, ...)

.claude/skills/<name>/    # Reusable agent workflows
  SKILL.md                # YAML frontmatter + instructions

CHANGELOG.md              # Per-release public notes
README.md                 # Outward-facing project intro
todo.md                   # Loose, informal capture (not a roadmap)
WORKFLOW.md               # ← this file
```

---

## TL;DR — *the one-line version*

> **Spec → Branch → Spec → Code → Test → Ship → Doc.**
> Repeat per phase. Capture pain as skills.
