# Product Match

128 products compete in a seven-day, single-elimination Arena. This repository contains the Next.js MVP and its Supabase backend.

## Setup

Requirements: Node.js 22+, npm, and a Supabase project.

1. Copy `.env.example` to `apps/web/.env` and fill in the Supabase values.
2. Apply `supabase/migrations/202609020001_initial_schema.sql` to the Supabase database.
3. Enable Email, Google, and GitHub providers in Supabase Auth as needed.
4. Add `http://localhost:3000/auth/callback` to the allowed redirect URLs.
5. Run `npm install`, then `npm run dev`.

To create the first administrator, sign up normally and run:

```sql
update public.profiles set role = 'admin' where username = 'maker-xxxxxxxx';
```

The `settle-matches` Edge Function should be scheduled every five minutes with a bearer token matching `CRON_SECRET`. It activates scheduled matches, settles completed voting windows, advances brackets, and crowns Arena champions.

## Main paths

- `/discover` — gated discovery feed
- `/arenas` — Arena list and brackets
- `/matches/[id]` — voting
- `/submit` — product submission
- `/dashboard` — Maker dashboard
- `/admin` — moderation and Arena generation

The full product specification is in `docs/spec.md`.
