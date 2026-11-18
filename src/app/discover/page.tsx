import type { Metadata } from "next";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/site";
import CategoryCard from "@/components/CategoryCard";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Discover",
  description: "Browse everything Discaro tracks: freebies, rewards, technology, tutorials, opportunities and reviews.",
};

export default function DiscoverPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-ink">Discover</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
        Everything Discaro tracks, in six shelves. Site-wide search joins in Phase 2, together with
        the article system — until then, browse by category.
      </p>
      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-accent-deep">
        <Search className="h-4 w-4" aria-hidden /> Search arrives with the content system in Phase 2
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
      <div className="mt-10">
        <NewsletterCTA />
      </div>
    </main>
  );
}
