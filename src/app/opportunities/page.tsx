import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchCheck } from "lucide-react";
import {
  getOpportunities,
  getOpportunityRegions,
  getPostsByCategory,
} from "@/lib/data";
import NewsletterCTA from "@/components/NewsletterCTA";
import OpportunityCard from "@/components/OpportunityCard";
import PostCard from "@/components/PostCard";

// Database-driven route: rendered per request, never prerendered.
export const instant = false;

export const metadata: Metadata = {
  title: "Opportunity Directory",
  description:
    "Verified grants, fellowships, jobs, competitions and programmes — with eligibility, deadlines and official application links.",
};

const PAGE_SIZE = 12;

function filterHref(params: { q?: string; status?: string; region?: string }, page: number) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.status) sp.set("status", params.status);
  if (params.region) sp.set("region", params.region);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/opportunities?${qs}` : "/opportunities";
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; region?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filters = {
    q: (sp.q ?? "").trim() || undefined,
    status: sp.status || undefined,
    region: sp.region || undefined,
  };
  const page = Number(sp.page) || 1;
  const [{ items, total }, regions, articles] = await Promise.all([
    getOpportunities({ ...filters, page, pageSize: PAGE_SIZE }),
    getOpportunityRegions(),
    getPostsByCategory("opportunities", 1, 3),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const isFiltered = Boolean(filters.q || filters.status || filters.region);
  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold tracking-wide text-accent-deep">THE DIRECTORY</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">Opportunities</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
        Grants, fellowships, jobs, competitions and programmes — each one checked by a person
        against its official source, with who is eligible, what it offers, and when it closes.
        Expired listings stay visible and marked, so you never chase a closed door.
      </p>
      {total > 0 && (
        <p className="mt-3 text-sm font-medium text-muted" role="status">
          {total} {total === 1 ? "opportunity" : "opportunities"} listed
          {isFiltered ? " matching your filters" : ""}
        </p>
      )}

      {/* Filters — plain GET form, works without JavaScript */}
      <form
        action="/opportunities"
        method="get"
        className="mt-8 grid gap-3 rounded-3xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto]"
        role="search"
      >
        <div>
          <label htmlFor="opp-q" className="sr-only">Search opportunities</label>
          <input id="opp-q" name="q" type="search" defaultValue={filters.q ?? ""} placeholder="Search opportunities…" className={inputCls} />
        </div>
        <div>
          <label htmlFor="opp-status" className="sr-only">Status</label>
          <select id="opp-status" name="status" defaultValue={filters.status ?? ""} className={inputCls}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label htmlFor="opp-region" className="sr-only">Region</label>
          <select id="opp-region" name="region" defaultValue={filters.region ?? ""} className={inputCls}>
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep">
            Filter
          </button>
          {isFiltered && (
            <Link href="/opportunities" className="text-sm font-semibold text-accent hover:text-accent-deep">
              Clear
            </Link>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-surface px-6 py-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
            <SearchCheck className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
            {isFiltered ? "Nothing matches those filters" : "The directory is being stocked — carefully"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            {isFiltered
              ? "Try widening the status or region, or clear the filters to see everything listed so far."
              : "Every opportunity here is verified against its official source before it appears — real programmes with real deadlines, never invented listings. The first verified entries are on their way."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-between" aria-label="Opportunity pages">
              {safePage > 1 ? (
                <Link href={filterHref(filters, safePage - 1)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep">
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Previous
                </Link>
              ) : <span />}
              <span className="text-sm text-muted">Page {safePage} of {totalPages}</span>
              {safePage < totalPages ? (
                <Link href={filterHref(filters, safePage + 1)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep">
                  Next <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : <span />}
            </nav>
          )}
        </>
      )}

      {articles.posts.length > 0 && (
        <section className="mt-16" aria-labelledby="opp-articles">
          <h2 id="opp-articles" className="text-2xl font-bold tracking-tight text-ink">
            Guides & articles on opportunities
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Know an opportunity we&apos;re missing?
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
          Suggest it and we&apos;ll check it against its official source. Verified suggestions
          join the directory — that&apos;s how it grows without ever listing anything unchecked.
        </p>
        <Link
          href="/submit"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
        >
          Suggest an opportunity <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      <div className="mt-12">
        <NewsletterCTA />
      </div>
    </main>
  );
}
