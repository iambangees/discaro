-- Discaro: article comments + moderation (Phase 6 completion).
-- Run in the Supabase SQL Editor (Run and enable RLS).
-- Visitors must be signed in to comment. Every comment starts as
-- "pending" and only becomes public when an admin approves it in
-- /admin/comments. Nothing here needs new API keys.

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx
  on comments (post_id, status, created_at);
create index if not exists comments_status_idx
  on comments (status, created_at);

alter table comments enable row level security;

-- Read: approved comments are public; authors can always see their own
-- (so a pending comment shows for its author with a "pending" note);
-- admins see everything.
drop policy if exists "comments are readable" on comments;
create policy "comments are readable"
  on comments for select
  using (status = 'approved' or auth.uid() = user_id or public.is_admin());

-- Write: signed-in visitors comment only as themselves, and a new
-- comment is always pending — nobody can post straight to public.
drop policy if exists "users add own comments" on comments;
create policy "users add own comments"
  on comments for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Authors can delete their own comments.
drop policy if exists "users delete own comments" on comments;
create policy "users delete own comments"
  on comments for delete
  using (auth.uid() = user_id);

-- Admins manage everything (the moderation queue).
drop policy if exists "admins manage comments" on comments;
create policy "admins manage comments"
  on comments for all
  using (public.is_admin()) with check (public.is_admin());
