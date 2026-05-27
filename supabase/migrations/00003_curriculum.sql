-- DataQuest Analytics: Curriculum Schema
-- Run this in Supabase SQL Editor

-- 1. Phases
create table if not exists phases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  order_index int not null default 0,
  icon text not null default 'Globe',
  unlock_level int not null default 1,
  created_at timestamptz default now()
);

-- 2. Modules
create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid references phases(id) on delete cascade not null,
  title text not null,
  description text not null,
  order_index int not null default 0,
  unlock_level int not null default 1,
  created_at timestamptz default now()
);

-- 3. Topics
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references modules(id) on delete cascade not null,
  title text not null,
  lesson_content text not null default '',
  order_index int not null default 0,
  xp_reward int not null default 50,
  unlock_level int not null default 1,
  created_at timestamptz default now()
);

-- 4. Quests
create table if not exists quests (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade not null,
  title text not null,
  description text not null,
  type text not null check (type in ('task', 'project', 'boss_fight')),
  instructions text not null default '',
  xp_reward int not null default 25,
  difficulty text not null default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz default now()
);

-- 5. User Progress
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references topics(id) on delete cascade not null,
  completed boolean default false,
  completed_quests text[] default '{}',
  xp_earned int default 0,
  updated_at timestamptz default now(),
  unique(user_id, topic_id)
);

-- Enable RLS
alter table phases enable row level security;
alter table modules enable row level security;
alter table topics enable row level security;
alter table quests enable row level security;
alter table user_progress enable row level security;

-- Public read access for curriculum
create policy "Phases are publicly readable" on phases for select using (true);
create policy "Modules are publicly readable" on modules for select using (true);
create policy "Topics are publicly readable" on topics for select using (true);
create policy "Quests are publicly readable" on quests for select using (true);

-- User-specific progress
create policy "Users can read their own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users can insert their own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update their own progress" on user_progress for update using (auth.uid() = user_id);
