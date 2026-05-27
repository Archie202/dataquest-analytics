-- Run this in your Supabase SQL Editor
-- Creates tables for quest progression persistence

-- ─── Quest Submissions ───────────────────────────────────────────────────
-- Tracks every quest a user has submitted, with answer and result

create table if not exists public.quest_submissions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id text not null,
  submitted_answer text,
  is_correct boolean default false,
  retries_used integer default 0,
  completed boolean default false,
  xp_earned integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint quest_submissions_pkey primary key (id),
  constraint quest_submissions_user_quest_unique unique (user_id, quest_id)
);

-- ─── Topic Progress ──────────────────────────────────────────────────────
-- Tracks overall completion per topic

create table if not exists public.topic_progress (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  completed boolean default false,
  quests_completed integer default 0,
  total_quests integer default 0,
  xp_earned integer default 0,
  updated_at timestamptz default now(),
  constraint topic_progress_pkey primary key (id),
  constraint topic_progress_user_topic_unique unique (user_id, topic_id)
);

-- ─── Module Progress ────────────────────────────────────────────────────
-- Tracks completion per module

create table if not exists public.module_progress (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  completed boolean default false,
  updated_at timestamptz default now(),
  constraint module_progress_pkey primary key (id),
  constraint module_progress_user_module_unique unique (user_id, module_id)
);

-- ─── RLS Policies ──────────────────────────────────────────────────────────
-- Users can only read/write their own progress

alter table public.quest_submissions enable row level security;
alter table public.topic_progress enable row level security;
alter table public.module_progress enable row level security;

-- Quest submissions policies
create policy "Users can view their own quest submissions"
  on public.quest_submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own quest submissions"
  on public.quest_submissions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own quest submissions"
  on public.quest_submissions for update
  using (auth.uid() = user_id);

-- Topic progress policies
create policy "Users can view their own topic progress"
  on public.topic_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own topic progress"
  on public.topic_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own topic progress"
  on public.topic_progress for update
  using (auth.uid() = user_id);

-- Module progress policies
create policy "Users can view their own module progress"
  on public.module_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own module progress"
  on public.module_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own module progress"
  on public.module_progress for update
  using (auth.uid() = user_id);

-- ─── Indexes ───────────────────────────────────────────────────────────────

create index if not exists idx_quest_submissions_user on public.quest_submissions(user_id);
create index if not exists idx_quest_submissions_quest on public.quest_submissions(quest_id);
create index if not exists idx_topic_progress_user on public.topic_progress(user_id);
create index if not exists idx_module_progress_user on public.module_progress(user_id);
