# Running ML Daily Application

This guide explains how to run the ML Daily app locally from scratch.

## Prerequisites

- Node.js 24 (recommended)
- pnpm
- Supabase account

## Project structure

- `artifacts/api-server`: Express backend (serves `/api/*`)
- `artifacts/ml-daily`: Vite + React frontend
- `lib/db`: Drizzle ORM schema and migration
- `migration.sql`: full schema + seed data

## 1. Setup environment variables

Copy `.env.example` to `.env` in repo root:

```bash
cp .env.example .env
```

Fill in your Supabase values in `.env`:

```ini
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

## 2. Create schema + seed

### Preferred: Supabase SQL editor

1. Open Supabase dashboard → SQL editor
2. Open `migration.sql` from repository
3. Run it

### Alternate: Drizzle CLI

```bash
cd lib/db
pnpm run push
```

## 3. Install dependencies

```bash
cd /path/to/ML-Daily
pnpm install
```

## 4. Start backend

```bash
cd artifacts/api-server
pnpm run build
pnpm run start
```

Backend listens on `http://localhost:8000` and handles `/api/*`.

## 5. Start frontend

```bash
cd artifacts/ml-daily
pnpm run dev
```

Frontend listens on `http://localhost:3000/artifacts`.

## 6. Verify

Browser: `http://localhost:3000/artifacts`

Health check:

```bash
curl http://localhost:3000/api/healthz
```

## Troubleshooting

- If backend dev script fails due to `cross-env`, use build+start as above.
- If API returns errors, verify both servers are running and the Vite proxy is configured to forward `/api` to `http://localhost:8000`.
- If migrating data fails over CLI, use Supabase SQL editor with `migration.sql`.

## Notes

- `migration.sql` includes table creation and data insert steps.
- Clean repo state: temporary migration scripts removed after manual cleanup.</content>
<parameter name="filePath">/home/zhunxeal/code/ML-Daily/RUNNING.md