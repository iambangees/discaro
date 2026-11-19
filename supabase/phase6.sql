-- Discaro Phase 6: visitor accounts + bookmarks.
-- Run in the Supabase SQL Editor (Run and enable RLS).
-- The bookmarks table itself already exists (Phase 1 schema); this adds
-- profiles, the sign-up profile trigger, and owner-only RLS on bookmarks.

-- ---------- profiles ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;

drop policy if exists "profiles are public" on profiles;
create policy "profiles are public"
  on profiles for select using (true);

drop policy if exists "users update own profile" on profiles;
create policy "users update own profile"
  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users insert own profile" on profiles;
create policy "users insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Create a profile automatically when a visitor signs up. The display
-- name comes from the sign-up form (user metadata) or the email prefix.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- bookmarks: owner-only access ----------
alter table bookmarks enable row level security;

drop policy if exists "users read own bookmarks" on bookmarks;
create policy "users read own bookmarks"
  on bookmarks for select using (auth.uid() = user_id);

drop policy if exists "users add own bookmarks" on bookmarks;
create policy "users add own bookmarks"
  on bookmarks for insert with check (auth.uid() = user_id);

drop policy if exists "users remove own bookmarks" on bookmarks;
create policy "users remove own bookmarks"
  on bookmarks for delete using (auth.uid() = user_id);

-- One bookmark per user per item.
create unique index if not exists bookmarks_user_post_key
  on bookmarks (user_id, post_id) where post_id is not null;
create unique index if not exists bookmarks_user_opp_key
  on bookmarks (user_id, opportunity_id) where opportunity_id is not null;
