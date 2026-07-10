-- ============================================================================
-- ToDo App — complete PostgreSQL schema for Supabase
-- ----------------------------------------------------------------------------
-- Paste this whole file into the Supabase SQL Editor and click "Run".
-- It is idempotent: safe to run multiple times.
--
-- Derived from the backend data layer:
--   server/src/models/user.model.ts   + server/src/repositories/user.repository.ts
--   server/src/models/task.model.ts   + server/src/repositories/task.repository.ts
--
-- Tables:
--   users  ( id, first_name, last_name, email, password_hash, created_at )
--   tasks  ( id, item, is_completed, user_id, created_at, updated_at )
--
-- AUTH MODEL — IMPORTANT:
--   This app does NOT use Supabase Auth. It has its own `users` table with a
--   bcrypt `password_hash`, and issues its own JWT (stored in an httpOnly cookie).
--   The backend connects with the SUPABASE SERVICE_ROLE key, which BYPASSES RLS.
--   All per-user access control (ownership, scoping) is enforced in the API's
--   repository/service layer — every task query is filtered by `user_id`.
--
--   RLS is therefore enabled with a default-deny posture (no permissive policies
--   for the anon/authenticated roles). This blocks any direct access via the
--   public anon key while the service-role API keeps full access. Do not add
--   `auth.uid()`-based policies here — they would never match, because these
--   rows are not tied to Supabase Auth users.
-- ============================================================================

-- gen_random_uuid() is core in Postgres 13+ (Supabase). pgcrypto is harmless/backup.
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Table: users
-- ─────────────────────────────────────────────────────────────
create table if not exists public.users (
  id            uuid        primary key default gen_random_uuid(),
  first_name    text        not null check (char_length(first_name) between 2 and 50),
  last_name     text        not null check (char_length(last_name)  between 2 and 50),
  email         text        not null,
  password_hash text        not null,
  created_at    timestamptz not null default now()
);

-- Case-insensitive uniqueness + fast lookups by email
-- (the API stores and queries emails lower-cased).
create unique index if not exists users_email_lower_idx
  on public.users (lower(email));

-- ─────────────────────────────────────────────────────────────
-- Table: tasks (todos)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.tasks (
  id           uuid        primary key default gen_random_uuid(),
  item         text        not null check (char_length(item) between 3 and 280),
  is_completed boolean     not null default false,
  user_id      uuid        not null references public.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- List query: filter by owner, newest first, paginated  →  (user_id, created_at desc)
create index if not exists tasks_user_id_created_at_idx
  on public.tasks (user_id, created_at desc);

-- Status filter (active/completed) scoped to owner  →  (user_id, is_completed)
create index if not exists tasks_user_id_is_completed_idx
  on public.tasks (user_id, is_completed);

-- ─────────────────────────────────────────────────────────────
-- Trigger: keep tasks.updated_at fresh on every UPDATE
-- (the API also sets it explicitly; this guarantees it regardless of path)
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row
  execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Row Level Security (default-deny; see AUTH MODEL note above)
-- ─────────────────────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.tasks enable row level security;

-- Force RLS even for the table owner role, so the ONLY unrestricted access is
-- the service-role key used by the backend. Direct anon/public access is denied.
alter table public.users force row level security;
alter table public.tasks force row level security;

-- (Intentionally no permissive policies. The service-role backend bypasses RLS;
--  everyone else is denied. If you ever migrate to Supabase Auth, add
--  auth.uid()-based policies here.)

-- ============================================================================
-- Optional: sanity check after running (uncomment to inspect)
-- ----------------------------------------------------------------------------
-- select table_name
--   from information_schema.tables
--  where table_schema = 'public'
--  order by table_name;
-- ============================================================================
