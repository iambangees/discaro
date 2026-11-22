-- Discaro: community submissions + affiliate click tracking.
-- Phase 6 completion — ONE run in the Supabase SQL Editor
-- (Run and enable RLS). No new API keys needed.
--
-- Submissions: signed-in visitors suggest opportunities for the
-- directory. Every suggestion starts "pending"; an admin reviews it in
-- /admin/submissions and approving CONVERTS it into a paused (hidden)
-- opportunity listing, which the admin verifies and activates by hand.
-- Nothing a visitor suggests is ever published automatically.
--
-- Affiliate clicks: the affiliate_links table already exists (Phase 1).
-- This adds the click log behind the /go/<id> redirect links, so the
-- admin can see how many clicks each affiliate link receives.

-- ---------- community submissions ----------
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 200),
  organisation text not null default '' check (char_length(organisation) <= 200),
  official_url text not null check (char_length(official_url) between 8 and 1000),
  summary text not null check (char_length(summary) between 10 and 2000),
  reward_info text not null default '' check (char_length(reward_info) <= 1000),
  expires_at date,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_opportunity_id uuid references opportunities(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists submissions_status_idx
  on submissions (status, created_at);

alter table submissions enable row level security;

-- Visitors suggest only as themselves, always as pending.
drop policy if exists "users add own submissions" on submissions;
create policy "users add own submissions"
  on submissions for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Submitters can follow their own suggestions (shown on /account).
drop policy if exists "users read own submissions" on submissions;
create policy "users read own submissions"
  on submissions for select
  using (auth.uid() = user_id);

-- Submitters can withdraw their own suggestions.
drop policy if exists "users delete own submissions" on submissions;
create policy "users delete own submissions"
  on submissions for delete
  using (auth.uid() = user_id);

-- Admins manage the review queue.
drop policy if exists "admins manage submissions" on submissions;
create policy "admins manage submissions"
  on submissions for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- affiliate click tracking ----------
create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references affiliate_links(id) on delete cascade,
  clicked_at timestamptz not null default now()
);
create index if not exists affiliate_clicks_link_idx
  on affiliate_clicks (link_id, clicked_at);

alter table affiliate_clicks enable row level security;

-- The /go/<id> redirect logs a click anonymously, like the public
-- report and newsletter forms log theirs. Counts are admin-only:
-- there is deliberately no public read policy on this table.
drop policy if exists "public can log a click" on affiliate_clicks;
create policy "public can log a click"
  on affiliate_clicks for insert
  with check (true);

drop policy if exists "admins manage affiliate clicks" on affiliate_clicks;
create policy "admins manage affiliate clicks"
  on affiliate_clicks for all
  using (public.is_admin()) with check (public.is_admin());
