# Tech — HabitFlow

## Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Familiar to team; SSR not strictly needed but futureproof |
| Language | **TypeScript** (strict) | Type safety from day one — no `any` allowed |
| Styling | **Tailwind CSS** | Fast iteration, utility-first |
| State | **React `useState` + `useReducer`** | No Redux/Zustand needed for v1 |
| Persistence | **`localStorage`** (v1) | No backend needed; future: swap with Supabase |
| Dates | **`date-fns`** | Lightweight, tree-shakable |
| Charts | **`recharts`** | When we hit Phase 4 (analytics) |
| Tests | **Vitest** + **React Testing Library** | Faster than Jest with Next.js |
| Icons | **lucide-react** | Clean, tree-shakable |

## Conventions
- **File naming**: `kebab-case.tsx` for files, `PascalCase` for components.
- **Folder structure**:
  ```
  app/                      # Next.js routes
  components/               # Reusable UI (PascalCase)
  features/<feature>/       # Per-feature: plan.md, requirements.md, validations.md, components/
  lib/                      # Pure helpers (date math, streak calc)
  hooks/                    # Custom React hooks
  tests/                    # All test files
  ```
- **No prop-drilling >2 levels** — lift to context or move state up.
- **Pure functions in `lib/`** — easy to unit test, no React inside.
- **No comments unless WHY is non-obvious** — let names do the talking.

## Hard rules (do not break)
1. **No `any` type** — use `unknown` and narrow.
2. **No `localStorage` access outside `lib/storage.ts`** — single boundary.
3. **No date arithmetic with raw `Date`** — always go through `lib/date.ts`.
4. **Every feature must have `validations.md`** before merging.

## Out of scope (v1)
- Authentication, multi-user, server, database, push notifications, mobile app.
