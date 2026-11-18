import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Flame,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CATEGORIES, SITE } from "@/lib/site";
import CategoryCard from "@/components/CategoryCard";
import NewsletterCTA from "@/components/NewsletterCTA";

const OPPORTUNITY_STATUSES = [
  { label: "Active", classes: "bg-emerald-100 text-emerald-800" },
  { label: "Upcoming", classes: "bg-accent-soft text-accent-deep" },
  { label: "Paused", classes: "bg-amber-100 text-amber-800" },
  { label: "Expired", classes: "bg-zinc-200 text-zinc-600" },
] as const;

const TRUST_POINTS = [
  {
    icon: BadgeCheck,
    title: "Checked by a person",
    text: "Every listing is verified by a human before it appears — the source, the terms and the expiry date.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing fictional",
    text: "If an opportunity isn't real and open, it doesn't appear here. Expired listings are marked, not hidden.",
  },
  {
    icon: CalendarClock,
    title: "Deadlines tracked",
    text: "Opportunities carry expiry and last-verified dates, so you never waste time on a closed programme.",
  },
] as const;

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold tracking-wide text-accent-deep">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            GLOBAL DIGITAL DISCOVERY
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Discover what's <span className="text-accent">worth knowing</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {SITE.name} hunts down the internet's genuinely useful freebies, rewards, tools,
            tutorials and opportunities — then checks each one by hand before it earns a place
            here.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              Browse opportunities
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/50 hover:text-accent-deep"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
              Explore categories
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent/50 hover:text-accent-deep"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="categories-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Start discovering
            </h2>
            <p className="mt-1.5 text-sm text-muted">Six shelves, one standard: worth your time.</p>
          </div>
          <Link href="/discover" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-accent sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Opportunity directory band */}
      <section className="bg-navy text-white" aria-labelledby="opportunities-heading">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 id="opportunities-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
                The Opportunity Directory
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                Not a blogroll — a directory. Every opportunity lists who is eligible, what's
                required, what you get, and when it ends, with a link to the official application
                page. When something expires, we say so.
              </p>
              <Link
                href="/opportunities"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
              >
                Open the directory
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid flex-1 grid-cols-2 gap-3" aria-label="Opportunity statuses">
              {OPPORTUNITY_STATUSES.map((s) => (
                <li key={s.label} className="rounded-2xl bg-white/5 p-5">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${s.classes}`}>
                    {s.label}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {s.label === "Active" && "Open now — verified and accepting entries."}
                    {s.label === "Upcoming" && "Announced — opening date on the listing."}
                    {s.label === "Paused" && "Temporarily closed — we watch for reopening."}
                    {s.label === "Expired" && "Closed — kept visible so you don't chase it."}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured & trending — honest empty states until Phase 2 content */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="featured-heading">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-surface p-8">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-accent-deep">
              <Sparkles className="h-4 w-4" aria-hidden /> FEATURED
            </p>
            <h2 id="featured-heading" className="mt-3 text-xl font-bold tracking-tight text-ink">
              Featured finds will live here
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Our editors' strongest picks — the free tool that replaces a paid one, the
              opportunity with a deadline this week. Publishing begins with the content system in
              Phase 2, and featured means <em>verified</em>, never paid placement without a label.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-8">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-accent-deep">
              <Flame className="h-4 w-4" aria-hidden /> TRENDING
            </p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-ink">
              Trending follows real readers
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Trending on {SITE.name} will rank what visitors actually read and save — not what
              advertisers boost. It switches on once real articles and readers exist, in Phase 2
              and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Why trust a listing here?
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TRUST_POINTS.map((t) => (
            <div key={t.title} className="rounded-2xl border border-line bg-surface p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                <t.icon className="h-5.5 w-5.5" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight text-ink">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <NewsletterCTA />
        </div>
      </section>
    </main>
  );
}
