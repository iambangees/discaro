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

- Known issue RESOLVED in Phase 5 (2026-11-18): missing article/opportunity URLs now return a true 404 via the proxy slug check.

## Phase 3 — Opportunity directory
- [x] Supabase schema: opportunities, eligibility, sources (in schema.sql, live since the 2026-11-18 run)
- [x] Directory with search + filters (text search, status, region/country — filters are URL-driven GET forms; results sorted active → upcoming → expired, soonest deadline first)
- [x] Opportunity detail pages: requirements, reward, key dates, eligibility, verified date, official apply link (with an anti-scam note), related article link
- [x] Status lifecycle: active / upcoming / expired / paused — stored status plus date-aware display (an 'active' listing past its expiry shows Expired; paused listings are held back from the public by RLS)
- [x] Report expired/broken flow (report form on each listing writes to the reports table under its public-insert RLS policy; reports are human-reviewed, listings never change automatically)

## Phase 4 — Admin dashboard & CMS
- [x] Supabase Auth for admin
- [x] CRUD for articles and opportunities, Tiptap rich-text editor
- [x] Image uploads via Supabase Storage
- [x] Drafts + scheduled publishing
- [x] Category/tag management, expiry & verification management

- [x] Deployed to Vercel 2026-11-18 — LIVE at https://discaro.vercel.app (Hobby account, auto-deploys on push to main; Supabase env vars set for Production + Preview; verified end-to-end by Muse: home, directory, category, search, static pages all 200 and rendering correctly)

Phase 4 built 2026-11-18: /admin (dashboard counts, article & opportunity CRUD,
Tiptap editor, cover uploads to a public Supabase Storage "media" bucket, tags
created from the editor + tag management page, reports inbox, subscribers list).
Scheduled publishing is real: the posts read policy now also serves 'scheduled'
posts whose published_at has passed. Access control: supabase/phase4.sql adds
an admins table + is_admin() policies (admins manage content; public read is
unchanged) and the media bucket. REMAINING SETUP (owner): create the admin user
in Supabase Authentication, then run supabase/phase4.sql — its final statement
grants admin to abubakarmmaina86@gmail.com. Until then /admin/login renders and
/admin redirects there, but nobody can sign in. Note: article bodies render the
editor's HTML as-is; the editor only produces its own toolbar's marks, and only
admins can write.

## Phase 5 — SEO, analytics, newsletter
- [x] Metadata, sitemap, robots, Open Graph (2026-11-18: metadataBase + OG/Twitter defaults,
  code-drawn opengraph-image, per-article/opportunity/category OG + canonicals,
  dynamic /sitemap.xml from the data layer, /robots.txt with /admin disallowed;
  soft-404 fixed the same day — the proxy checks slugs against the database and
  returns a true 404 for unknown article/opportunity URLs)
- [x] Google Analytics 4 (2026-11-19: direct gtag in the root layout, Measurement ID G-4F1MT4THQC; a GTM container GTM-K3ZX8TX4 also exists on his account but is deliberately not loaded, to avoid double-counting)
- [x] Newsletter subscribe + subscriber storage (2026-11-19: the homepage form saves real subscribers; sending live via Resend 2026-11-19 (RESEND_API_KEY set in Vercel for Production + Preview, redeployed and Ready); until a sending domain is verified, Resend's onboarding sender can only deliver to the account owner's own inbox — subscriber-wide delivery needs the domain decision in Phase 7)
- [ ] Performance pass (Core Web Vitals)

## Phase 6 — Accounts & community
- [x] Visitor accounts (email sign-up/sign-in, profiles table + sign-up trigger) + bookmarks/saved opportunities — built 2026-11-19 (supabase/phase6.sql, /login, /signup, /account, bookmark buttons on cards + detail pages). ACTIVATED 2026-11-19: phase6.sql run, Auth Site URL + redirect URLs set, and Abubakar tested sign-up end-to-end with a regular email (profile 'Bangees' created, /account renders)
- [ ] Comments + moderation
- [ ] Community submissions
- [ ] Affiliate tracking + disclosures on sponsored/affiliate content
- Known lint debt: src/components/admin/RichTextEditor.tsx trips the react-hooks "components during render" rule (11 errors, pre-existing since the Phase 4 editor rewrite; the production build passes and the editor works). Revisit in the Phase 7 pass.

## Phase 7 — Launch
- [x] Security review (2026-11-19: no secrets in the repo or its history and .env.local untracked; anonymous probes against the live database all correct — posts readable only when published and anonymous insert rejected 401, bookmarks owner-only, admins table invisible to anonymous, profiles public by design; baseline security headers added in next.config — nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy — on top of Vercel's HSTS, verified live)
- [x] Route smoke test (2026-11-19: home, discover, directory + both listings, article, search, login, signup, category, sitemap, robots and OG image all 200; unknown article URL returns a true 404)
- [ ] Pre-launch tidy (owner, 30 seconds in the CMS): the Commonwealth listing's slug still ends in "-organisation-commonwealth" from the original title slip — rename it to commonwealth-shared-scholarships-2027-28 before launch, while no external links exist to break
- [ ] RichTextEditor lint debt (11 pre-existing react-hooks errors; build passes)
- [ ] Performance pass (Core Web Vitals)
- [ ] discaro.com decision (registration ~$10-15/yr; also unlocks Resend domain verification for subscriber-wide newsletter delivery)
- [ ] Public launch

Phase 3 note (2026-11-18): directory verified locally with the empty database (filters, empty states, 404s) and its queries validated against the live schema (HTTP 200). Card/detail rendering with real entries gets exercised by the first real listing — no test data was inserted past the RLS, per the no-fictional-content rule.
