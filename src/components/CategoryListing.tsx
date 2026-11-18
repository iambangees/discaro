import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchCheck } from "lucide-react";
import type { Category } from "@/lib/site";
import { getPostsByCategory } from "@/lib/data";
import NewsletterCTA from "@/components/NewsletterCTA";
import PostCard from "@/components/PostCard";

export function categoryMetadata(category: Category): Metadata {
  return {
    title: category.name,
    description: `${category.name} on Discaro — ${category.blurb}`,
  };
}

const PAGE_SIZE = 9;

/*
  Database-driven category listing (Phase 2). When the category has no
  published articles yet, the page keeps the honest "being stocked"
  state from Phase 1 — no invented listings, ever.
*/
export default async function CategoryListing({
  category,
  page = 1,
}: {
  category: Category;
  page?: number;
}) {
  const { posts, total } = await getPostsByCategory(category.slug, page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All categories
      </Link>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
        {category.name} on Discaro means{category.longBlurb}
      </p>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-surface px-6 py-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
            <SearchCheck className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
            This section is being stocked — carefully
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Every {category.name.toLowerCase()} listing on Discaro is checked by a person before
            it appears here, so this page fills up with verified entries rather than scraped
            filler. {category.phase}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-between"
              aria-label={`${category.name} pages`}
            >
              {safePage > 1 ? (
                <Link
                  href={`/${category.slug}?page=${safePage - 1}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Newer
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-muted">
                Page {safePage} of {totalPages}
              </span>
              {safePage < totalPages ? (
                <Link
                  href={`/${category.slug}?page=${safePage + 1}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
                >
                  Older <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}

      <div className="mt-10">
        <NewsletterCTA />
      </div>
    </main>
  );
}
