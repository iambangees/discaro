import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, SearchCheck } from "lucide-react";
import type { Category } from "@/lib/site";
import NewsletterCTA from "@/components/NewsletterCTA";

/*
  Phase 1 category landing shell. Article and opportunity content is
  database-driven from Phase 2/3 — until then these pages describe the
  section honestly instead of showing invented listings.
*/
export function categoryMetadata(category: Category): Metadata {
  return {
    title: category.name,
    description: `${category.name} on Discaro — ${category.blurb}`,
  };
}

export default function CategoryShell({ category }: { category: Category }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All categories
      </Link>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
        {category.name} on Discaro means{category.longBlurb}
      </p>

      <div className="mt-10 rounded-3xl border border-dashed border-line bg-surface px-6 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
          <SearchCheck className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
          This section is being stocked — carefully
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Every {category.name.toLowerCase()} listing on Discaro is checked by a person before it
          appears here, so this page fills up with verified entries rather than scraped filler.{" "}
          {category.phase}
        </p>
      </div>

      <div className="mt-10">
        <NewsletterCTA />
      </div>
    </main>
  );
}
