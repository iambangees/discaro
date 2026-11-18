-- Discaro — Phase 2 database schema (Supabase / PostgreSQL)
-- Run this in the Supabase SQL Editor once, on the fresh project.
-- Content model per PROJECT_BLUEPRINT.md §5. Opportunities stay a separate
-- entity from articles but can link to them. Nothing here seeds fake
-- content — categories only, because they are fixed site structure.

create extension if not exists "pgcrypto";

-- ---------- fixed structure ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  blurb text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- ---------- articles ----------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  body text not null default '',            -- rich text (Tiptap HTML) from Phase 4
  category_id uuid references categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','scheduled','published')),
  featured boolean not null default false,
  trending_score int not null default 0,
  cover_image_url text,
  affiliate boolean not null default false, -- drives the disclosure label
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists post_tags (
  post_id uuid not null references posts(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ---------- opportunity directory ----------
create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  organisation text not null default '',
  summary text not null default '',
  requirements text not null default '',
  reward_info text not null default '',
  official_url text not null,               -- the real application link
  source_url text,                          -- where we verified it
  status text not null default 'active' check (status in ('active','upcoming','expired','paused')),
  opens_at timestamptz,
  expires_at timestamptz,
  last_verified_at timestamptz,             -- shown publicly; honesty is the product
  related_post_id uuid references posts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- country/region eligibility per opportunity ("Worldwide" = one row)
create table if not exists eligibility (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  region text not null,                     -- e.g. 'Worldwide', 'Nigeria', 'Africa', 'EU'
  notes text not null default ''
);

-- ---------- supporting tables ----------
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists affiliate_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  merchant text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists reports (        -- "report expired / broken" from visitors
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references opportunities(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  reason text not null default '',
  status text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists bookmarks (       -- Phase 6 (visitor accounts)
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  post_id uuid references posts(id) on delete cascade,
  opportunity_id uuid references opportunities(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------- the six fixed categories (structure, not content) ----------
insert into categories (slug, name, blurb) values
  ('freebies',     'Freebies',     'Free products, trials, credits and samples worth claiming.'),
  ('rewards',      'Rewards',      'Programmes that pay you back: cashback, points, bonuses and perks.'),
  ('technology',   'Technology',   'Tools, platforms and product news that change how you work.'),
  ('tutorials',    'Tutorials',    'Step-by-step guides that take you from stuck to done.'),
  ('opportunities','Opportunities','Grants, fellowships, jobs, competitions and programmes open now.'),
  ('reviews',      'Reviews',      'Honest, hands-on verdicts on tools and services.')
on conflict (slug) do nothing;

-- ---------- row level security ----------
-- Public visitors may read published posts and non-expired directory data.
-- All writes happen through the admin (service role) until Phase 4/6.
alter table categories enable row level security;
alter table tags enable row level security;
alter table posts enable row level security;
alter table post_tags enable row level security;
alter table opportunities enable row level security;
alter table eligibility enable row level security;
alter table affiliate_links enable row level security;
alter table newsletter_subscribers enable row level security;
alter table reports enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read tags" on tags for select using (true);
create policy "public read published posts" on posts for select using (status = 'published');
create policy "public read post_tags" on post_tags for select using (true);
create policy "public read opportunities" on opportunities for select using (status <> 'paused');
create policy "public read eligibility" on eligibility for select using (true);
create policy "public read active affiliate links" on affiliate_links for select using (active = true);
create policy "public can subscribe" on newsletter_subscribers for insert with check (true);
create policy "public can report" on reports for insert with check (true);
