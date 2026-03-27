# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (not used for ML Daily — uses JSON files)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   │   └── src/data/       # JSON lesson data files (lessons, categories, challenges)
│   └── ml-daily/           # ML Daily React + Vite frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## ML Daily App

**Purpose**: Mobile-first machine learning learning app (dark mode, card-based design).

**Features**:
- Home feed with lesson cards (title, description, difficulty badge, category)
- Lesson detail with full explanation, examples, MCQ quiz
- Streak system (localStorage, auto-tracked on load)
- Progress tracking (completed lessons, progress bar)
- Categories page (Beginner, Supervised, Unsupervised, Deep Learning)
- Daily challenge with XP reward
- Badges system (First Step, Getting Started, Dedicated Learner, 3-Day Streak, Week Warrior)
- Bottom navigation: Home, Categories, Progress, Profile
- Framer Motion animations
- Zustand store persisted to localStorage

**Data**: JSON files in `artifacts/api-server/src/data/` — no database needed for lesson content.

**API Endpoints** (all under `/api`):
- `GET /api/lessons` — all lessons
- `GET /api/lessons/:id` — single lesson
- `GET /api/categories` — all categories
- `GET /api/daily-challenge` — today's daily challenge

**Frontend Key Files**:
- `artifacts/ml-daily/src/store/use-stats.ts` — Zustand store for streak/progress/badges
- `artifacts/ml-daily/src/pages/` — Home, Categories, LessonDetail, Progress, Profile, Challenge
- `artifacts/ml-daily/src/components/layout/` — AppLayout, BottomNav, TopBar
- `artifacts/ml-daily/src/components/ui/lesson-card.tsx` — Lesson card component

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes in `src/routes/`, data in `src/data/`.

- `pnpm --filter @workspace/api-server run dev` — run the dev server

### `artifacts/ml-daily` (`@workspace/ml-daily`)

React + Vite frontend for ML Daily.

- `pnpm --filter @workspace/ml-daily run dev` — run the dev server
- Key deps: framer-motion, zustand, date-fns, canvas-confetti

### `lib/api-spec` (`@workspace/api-spec`)

Run codegen: `pnpm --filter @workspace/api-spec run codegen`
