-- DataQuest Analytics: Profiles & Auth
-- Run this first in Supabase SQL Editor

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null default '',
  full_name text default '',
  avatar_url text default '',
  xp int not null default 0,
  level int not null default 1,
  streak_days int not null default 0,
  analytics_coins int not null default 0,
  lessons_completed int not null default 0,
  badges text[] default '{}',
  onboarding_completed boolean default false,
  primary_skill text,
  experience_level text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on profile changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Anyone can insert their own profile" on public.profiles;
create policy "Anyone can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Indexes
create index if not exists idx_profiles_xp on public.profiles(xp desc);
create index if not exists idx_profiles_level on public.profiles(level desc);
