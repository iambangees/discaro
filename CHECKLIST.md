# Discaro — Build Checklist

Kept per the blueprint's development rules: nothing is silently skipped, and each phase is tested before moving to the next.

## Setup
- [x] Blueprint saved to the project (PROJECT_BLUEPRINT.md)
- [x] Brand check (2026-11-18): **CONFLICT FOUND** — veylo.com belongs to a funded US enterprise AI company (BlueGenAI rebranded to "Veylo" in Sept 2026, actively promoting the brand); a Brazilian "Veylo CRM" also exists. Building a tech platform under this exact name carries trademark/confusion risk.
- [x] DECISION (2026-11-18): Abubakar chose "find a new name first, before we go further".
- [x] NEW NAME — research done 2026-11-18: ~20 candidates checked; the obvious ones are all taken (Scoutly, Oppora, Perkly, Gainly, Findstack, Seekly, Discovia, Lootra, Trovia, Zavora, Kovra, Bountly...). Four verified survivors — no existing brand found AND .com available per Verisign RDAP: **Discaro** (discaro.com), **Worthovia** (worthovia.com), **Scovoria** (scovoria.com), **Lootovia** (lootovia.com). **Abubakar picked Discaro on 2026-11-18**; project renamed the same day (folder, code, docs). discaro.com registration is parked at his choice — the site deploys free (Vercel) until he buys it.
- [ ] Domain availability check: veylo.com confirmed TAKEN (live company site). Other TLDs (.io/.co/.app/.net) unverified — RDAP did not answer from this network on 2026-11-18; recheck later or at a registrar.
- [x] Next.js + TypeScript + Tailwind project scaffolded (Next 16.4.6, React 19.3.0, Tailwind 4.3.3, App Router, src dir; lucide-react installed)
- [x] Test: production build passes on the scaffold (2026-11-18)
- [ ] GitHub repo created (by Abubakar) and code pushed
- [ ] Supabase project created (by Abubakar) and connected
- [ ] Vercel project connected (by Abubakar) for deploys

## Phase 1 — Setup, design system, navigation, homepage
- [x] Design tokens: light theme, deep navy text, electric blue accent, modern sans (globals.css @theme; built 2026-11-18)
- [x] Layout: header/nav with categories, footer with legal links (Header/Footer components)
- [x] Homepage: hero, featured, trending, category sections, newsletter block (featured/trending are honest empty states until Phase 2 content exists; newsletter form is honest that subscriptions open in Phase 5 — nothing is faked)
- [x] Static pages: About, Contact, Privacy Policy, Terms, Affiliate Disclosure (+ Discover and a custom 404)
- [x] Category shells for all six categories (honest "being stocked" states; real content is database-driven in Phase 2/3)
- [x] Mobile responsive + accessibility pass (responsive Tailwind layouts, aria labels, landmarks)
- [x] Test: production build passes (14 routes, all static), lint clean, live render check passed (2026-11-18)
- [x] Push to GitHub — repo created by Abubakar 2026-11-18, code pushed and verified (github.com/iambangees/discaro)

## Phase 2 — Articles, categories, search, content system
- [x] Supabase schema: posts, categories, tags (+ join tables) — run by Abubakar in the SQL Editor 2026-11-18 and verified live by Muse: all 6 categories present, posts/opportunities tables live and empty (no fake content), and an anonymous write probe was correctly rejected (401) — RLS is enforcing.
- [x] Article page with related articles (`/articles/[slug]`, affiliate disclosure banner, updated-date, related-by-category)
- [x] Category listing pages with pagination (database-driven; honest empty state until verified content exists)
- [x] Site-wide search (`/search`, hero + Discover forms, header search icon; title/excerpt matching over published posts)
- [ ] Seed with real, verified content only (never fictional)

- Known issue (Phase 5 SEO): a missing article URL renders the 404 page with HTTP 200 (static shell streams first under Next 16 cache components) — revisit for a hard 404.

## Phase 3 — Opportunity directory
- [x] Supabase schema: opportunities, eligibility, sources (in schema.sql, live since the 2026-11-18 run)
- [x] Directory with search + filters (text search, status, region/country — filters are URL-driven GET forms; results sorted active → upcoming → expired, soonest deadline first)
- [x] Opportunity detail pages: requirements, reward, key dates, eligibility, verified date, official apply link (with an anti-scam note), related article link
- [x] Status lifecycle: active / upcoming / expired / paused — stored status plus date-aware display (an 'active' listing past its expiry shows Expired; paused listings are held back from the public by RLS)
- [x] Report expired/broken flow (report form on each listing writes to the reports table under its public-insert RLS policy; reports are human-reviewed, listings never change automatically)

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

Phase 3 note (2026-11-18): directory verified locally with the empty database (filters, empty states, 404s) and its queries validated against the live schema (HTTP 200). Card/detail rendering with real entries gets exercised by the first real listing — no test data was inserted past the RLS, per the no-fictional-content rule.
