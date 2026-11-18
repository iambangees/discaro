# Veylo — Build Checklist

Kept per the blueprint's development rules: nothing is silently skipped, and each phase is tested before moving to the next.

## Setup
- [x] Blueprint saved to the project (PROJECT_BLUEPRINT.md)
- [ ] Brand check: existing companies/products named Veylo
- [ ] Domain availability check (veylo.com and fallbacks)
- [ ] Next.js + TypeScript + Tailwind project scaffolded
- [ ] GitHub repo created (by Abubakar) and code pushed
- [ ] Supabase project created (by Abubakar) and connected
- [ ] Vercel project connected (by Abubakar) for deploys

## Phase 1 — Setup, design system, navigation, homepage
- [ ] Design tokens: light theme, deep navy text, electric blue accent, modern sans
- [ ] Layout: header/nav with categories, footer with legal links
- [ ] Homepage: hero, featured, trending, category sections, newsletter block
- [ ] Static pages: About, Contact, Privacy Policy, Terms, Affiliate Disclosure
- [ ] Mobile responsive + accessibility pass
- [ ] Test: production build passes, pages render

## Phase 2 — Articles, categories, search, content system
- [ ] Supabase schema: posts, categories, tags (+ join tables)
- [ ] Article page with related articles
- [ ] Category listing pages with pagination
- [ ] Site-wide search
- [ ] Seed with real, verified content only (never fictional)

## Phase 3 — Opportunity directory
- [ ] Supabase schema: opportunities, eligibility, sources
- [ ] Directory with search + filters (category, country, status)
- [ ] Opportunity detail pages: requirements, reward, expiry, verified date, official link
- [ ] Status lifecycle: active / upcoming / expired / paused
- [ ] Report expired/broken flow (reports table)

## Phase 4 — Admin dashboard & CMS
- [ ] Supabase Auth for admin
- [ ] CRUD for articles and opportunities, Tiptap rich-text editor
- [ ] Image uploads via Supabase Storage
- [ ] Drafts + scheduled publishing
- [ ] Category/tag management, expiry & verification management

## Phase 5 — SEO, analytics, newsletter
- [ ] Metadata, sitemap, robots, Open Graph
- [ ] Google Analytics
- [ ] Newsletter subscribe (Resend) + subscriber storage
- [ ] Performance pass (Core Web Vitals)

## Phase 6 — Accounts & community (future)
- [ ] Visitor accounts, bookmarks/saved opportunities
- [ ] Comments + moderation
- [ ] Community submissions
- [ ] Affiliate tracking + disclosures on sponsored/affiliate content

## Phase 7 — Launch
- [ ] Security review (RLS policies, keys, auth)
- [ ] Full test pass on mobile + desktop
- [ ] Public launch
