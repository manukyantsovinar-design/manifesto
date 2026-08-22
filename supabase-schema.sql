create extension if not exists pgcrypto;

create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  want text not null,
  why text not null,
  give text not null,
  consent boolean not null default true,
  created_at timestamptz not null default now(),
  next_email_at timestamptz not null
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references letters(id) on delete cascade,
  moved text not null,
  blocked text not null,
  next_step text not null,
  created_at timestamptz not null default now()
);

create index if not exists letters_next_email_at_idx on letters (next_email_at);
create index if not exists checkins_letter_id_idx on checkins (letter_id);

-- Row-level security is enabled with no policies, which denies all access
-- by default. The app only ever talks to Supabase from server-side code
-- using the service role key, which bypasses RLS, so no policy is needed —
-- this just guarantees nothing is reachable directly from a browser.
alter table letters enable row level security;
alter table checkins enable row level security;
