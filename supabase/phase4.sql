-- Discaro — Phase 4 migration: admin access + storage (Supabase / PostgreSQL)
-- Run AFTER creating your admin user (Supabase → Authentication → Users →
-- Add user, with "Auto Confirm User" on). The final statement grants admin
-- to that account by email. Safe to run once; re-running errors on the
-- duplicate policies, which is fine — everything before still applied.

-- ---------- who is an admin ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create policy "admins can read the admins table"
  on public.admins for select using (public.is_admin());

-- ---------- admins can manage content (public read policies unchanged) ----------
create policy "admins manage posts" on public.posts for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage categories" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage tags" on public.tags for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage post_tags" on public.post_tags for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage opportunities" on public.opportunities for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage eligibility" on public.eligibility for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage sources" on public.sources for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage media" on public.media for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage affiliate links" on public.affiliate_links for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins manage reports" on public.reports for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins read subscribers" on public.newsletter_subscribers for select
  using (public.is_admin());
create policy "admins delete subscribers" on public.newsletter_subscribers for delete
  using (public.is_admin());

-- ---------- scheduled publishing: a scheduled post becomes public at its time ----------
drop policy "public read published posts" on public.posts;
create policy "public read published posts" on public.posts for select
  using (
    status = 'published'
    or (status = 'scheduled' and published_at is not null and published_at <= now())
  );

-- ---------- image uploads: public "media" bucket, admins write ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select
  using (bucket_id = 'media');
create policy "admins upload media" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- ---------- grant admin to the site owner's account ----------
insert into public.admins (user_id)
select id from auth.users where email = 'abubakarmmaina86@gmail.com'
on conflict do nothing;
