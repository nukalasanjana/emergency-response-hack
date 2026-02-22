-- ============================================================
-- Community Alerts – Supabase Schema
-- Run this in the Supabase SQL Editor (or via psql).
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Communities (optional)
create table if not exists communities (
  id   uuid primary key default gen_random_uuid(),
  name text not null
);

-- 2. Profiles
create table if not exists profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  role              text not null default 'user' check (role in ('user','admin')),
  default_threshold int  not null default 5
);

-- 3. Community memberships
create table if not exists community_memberships (
  community_id uuid not null references communities(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  primary key (community_id, user_id)
);

-- 4. Reports
create table if not exists reports (
  id           uuid      primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  user_id      uuid      not null references profiles(id) on delete cascade,
  type         text      not null,
  title        text      not null,
  description  text      not null default '',
  lat          float     not null,
  lng          float     not null,
  community_id uuid      references communities(id) on delete set null,
  status       text      not null default 'open'
);

-- 5. Report votes (upvotes)
create table if not exists report_votes (
  id         uuid      primary key default gen_random_uuid(),
  report_id  uuid      not null references reports(id) on delete cascade,
  user_id    uuid      not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (report_id, user_id)
);

-- 6. Alerts
create table if not exists alerts (
  id             uuid      primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  report_id      uuid      not null references reports(id) on delete cascade,
  type           text      not null,
  message        text      not null,
  lat            float     not null,
  lng            float     not null,
  community_id   uuid      references communities(id) on delete set null,
  vote_threshold int       not null default 5,
  alerted_count  int       not null default 0
);

-- ============================================================
-- Row-Level Security (permissive for hackathon)
-- ============================================================

alter table profiles            enable row level security;
alter table reports             enable row level security;
alter table report_votes        enable row level security;
alter table alerts              enable row level security;
alter table communities         enable row level security;
alter table community_memberships enable row level security;

-- Profiles: users can read all, update own
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- Reports: anyone authed can read; insert own
create policy "reports_select" on reports for select using (true);
create policy "reports_insert" on reports for insert with check (auth.uid() = user_id);

-- Report votes: anyone authed can read; insert own
create policy "report_votes_select" on report_votes for select using (true);
create policy "report_votes_insert" on report_votes for insert with check (auth.uid() = user_id);

-- Alerts: anyone can read; insert via service role (backend)
create policy "alerts_select" on alerts for select using (true);
create policy "alerts_insert" on alerts for insert with check (true);          -- backend uses service role
create policy "alerts_update" on alerts for update using (true);

-- Communities / memberships: read all, insert own membership
create policy "communities_select" on communities for select using (true);
create policy "communities_insert" on communities for insert with check (true);
create policy "memberships_select" on community_memberships for select using (true);
create policy "memberships_insert" on community_memberships for insert with check (auth.uid() = user_id);

-- ============================================================
-- Realtime: enable realtime on alerts table
-- ============================================================
alter publication supabase_realtime add table alerts;
alter publication supabase_realtime add table reports;
alter publication supabase_realtime add table report_votes;

-- ============================================================
-- Helper: auto-create profile on signup (trigger)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
