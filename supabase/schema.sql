-- KhozAI: schema for personalized practice profiles
-- Run this once in Supabase SQL Editor (Project → SQL → New query)

-- ============================================
-- Table: profiles (one row per authenticated user)
-- ============================================
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  years_playing int not null default 0 check (years_playing >= 0 and years_playing <= 100),
  genres text[] not null default '{}',
  focus text not null check (focus in ('tecnica', 'improvisacion', 'teoria', 'lectura', 'ritmo')),
  time_per_day int not null check (time_per_day in (15, 25, 45, 60)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on every UPDATE
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================
-- Row Level Security — each user only sees their own row
-- ============================================
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);
