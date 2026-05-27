-- DataQuest Analytics: Gamification Expansion
-- Run this in Supabase SQL Editor after the previous migrations

-- ─── Achievements ──────────────────────────────────────────────────────────

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  category text not null check (category in ('curriculum', 'social', 'speed', 'special')),
  icon text not null default 'Trophy',
  rarity text not null default 'common' check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  xp_reward int not null default 100,
  criteria jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  progress int not null default 0,
  target int not null default 1,
  unlocked boolean not null default false,
  claimed boolean not null default false,
  unlocked_at timestamptz,
  claimed_at timestamptz,
  unique(user_id, achievement_id)
);

-- ─── Daily Quests (persistent) ────────────────────────────────────────────

create table if not exists public.user_daily_quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_title text not null,
  quest_description text not null,
  quest_type text not null check (quest_type in ('sql', 'python', 'excel', 'general')),
  xp_reward int not null default 50,
  coin_reward int not null default 10,
  progress int not null default 0,
  target int not null default 1,
  completed boolean not null default false,
  assigned_date date not null default current_date,
  unique(user_id, quest_title, assigned_date)
);

-- ─── Notifications ─────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'achievement', 'quest', 'streak', 'level_up')),
  read boolean not null default false,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ─── RLS Policies ─────────────────────────────────────────────────────────

alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.user_daily_quests enable row level security;
alter table public.notifications enable row level security;

-- Achievements are publicly readable
create policy "Achievements are publicly readable"
  on public.achievements for select using (true);

-- User achievements
create policy "Users can view their own achievements"
  on public.user_achievements for select using (auth.uid() = user_id);
create policy "Users can insert their own achievements"
  on public.user_achievements for insert with check (auth.uid() = user_id);
create policy "Users can update their own achievements"
  on public.user_achievements for update using (auth.uid() = user_id);

-- Daily quests
create policy "Users can view their own daily quests"
  on public.user_daily_quests for select using (auth.uid() = user_id);
create policy "Users can insert their own daily quests"
  on public.user_daily_quests for insert with check (auth.uid() = user_id);
create policy "Users can update their own daily quests"
  on public.user_daily_quests for update using (auth.uid() = user_id);

-- Notifications
create policy "Users can view their own notifications"
  on public.notifications for select using (auth.uid() = user_id);
create policy "Users can insert their own notifications"
  on public.notifications for insert with check (auth.uid() = user_id);
create policy "Users can update their own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- ─── Indexes ───────────────────────────────────────────────────────────────

create index if not exists idx_user_achievements_user on public.user_achievements(user_id);
create index if not exists idx_user_daily_quests_user on public.user_daily_quests(user_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id, read);

-- ─── Seed Achievement Definitions ─────────────────────────────────────────

insert into public.achievements (id, title, description, category, icon, rarity, xp_reward, criteria) values
  ('ach-first-quest', 'First Quest', 'Complete your first quest', 'curriculum', 'Sword', 'common', 50, '{"type": "quests_completed", "target": 1}'),
  ('ach-quest-master', 'Quest Master', 'Complete 50 quests', 'curriculum', 'Sword', 'rare', 500, '{"type": "quests_completed", "target": 50}'),
  ('ach-century', 'Century Club', 'Complete 100 quests', 'curriculum', 'Sword', 'epic', 1000, '{"type": "quests_completed", "target": 100}'),
  ('ach-phase-1', 'Phase 1 Complete', 'Complete all topics in Phase 1', 'curriculum', 'BookOpen', 'uncommon', 200, '{"type": "phase_complete", "phase": "phase-1"}'),
  ('ach-phase-2', 'Phase 2 Complete', 'Complete all topics in Phase 2', 'curriculum', 'BookOpen', 'rare', 400, '{"type": "phase_complete", "phase": "phase-2"}'),
  ('ach-phase-3', 'Phase 3 Complete', 'Complete all topics in Phase 3', 'curriculum', 'BookOpen', 'epic', 600, '{"type": "phase_complete", "phase": "phase-3"}'),
  ('ach-all-phases', 'DataQuest Champion', 'Complete all 4 phases', 'curriculum', 'Trophy', 'legendary', 2000, '{"type": "all_phases_complete"}'),
  ('ach-streak-3', 'Getting Started', 'Maintain a 3-day streak', 'special', 'Flame', 'common', 75, '{"type": "streak", "target": 3}'),
  ('ach-streak-7', 'Weekly Warrior', 'Maintain a 7-day streak', 'special', 'Flame', 'uncommon', 200, '{"type": "streak", "target": 7}'),
  ('ach-streak-30', 'Monthly Legend', 'Maintain a 30-day streak', 'special', 'Flame', 'epic', 1000, '{"type": "streak", "target": 30}'),
  ('ach-level-5', 'Apprentice Analyst', 'Reach Level 5', 'special', 'Zap', 'common', 100, '{"type": "level_reach", "target": 5}'),
  ('ach-level-10', 'Skilled Analyst', 'Reach Level 10', 'special', 'Zap', 'uncommon', 300, '{"type": "level_reach", "target": 10}'),
  ('ach-level-20', 'Expert Analyst', 'Reach Level 20', 'special', 'Zap', 'rare', 800, '{"type": "level_reach", "target": 20}'),
  ('ach-level-35', 'Data Master', 'Reach Level 35', 'special', 'Zap', 'legendary', 2000, '{"type": "level_reach", "target": 35}'),
  ('ach-sql-10', 'SQL Apprentice', 'Complete 10 SQL practice exercises', 'curriculum', 'Database', 'uncommon', 150, '{"type": "practice_complete", "skill": "sql", "target": 10}'),
  ('ach-python-10', 'Python Apprentice', 'Complete 10 Python practice exercises', 'curriculum', 'Terminal', 'uncommon', 150, '{"type": "practice_complete", "skill": "python", "target": 10}'),
  ('ach-social-profile', 'Social Butterfly', 'Complete your profile', 'social', 'Users', 'common', 50, '{"type": "profile_complete"}'),
  ('ach-speed-demon', 'Speed Demon', 'Complete a boss fight in under 5 minutes', 'speed', 'Zap', 'rare', 500, '{"type": "speed_run"}'),
  ('ach-boss-slayer', 'Boss Slayer', 'Complete 10 boss fights', 'curriculum', 'Swords', 'rare', 500, '{"type": "boss_fights", "target": 10}'),
  ('ach-collector', 'Achievement Collector', 'Unlock 10 achievements', 'social', 'Medal', 'epic', 750, '{"type": "achievements_unlocked", "target": 10}')
on conflict (id) do nothing;
