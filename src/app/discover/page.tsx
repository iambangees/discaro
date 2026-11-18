import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/site";
import { getLatestPosts } from "@/lib/data";
import CategoryCard from "@/components/CategoryCard";
import NewsletterCTA from "@/components/NewsletterCTA";
import PostCard from "@/components/PostCard";
import SearchForm from "@/components/SearchForm";

// Database-driven route: rendered per request, never prerendered.
export const instant = false;


export const metadata: Metadata = {
  title: "Discover",
  description:
    "Browse everything Discaro tracks: freebies, rewards, technology, tutorials, opportunities and reviews.",
};


export default async function DiscoverPage() {
  const latest = await getLatestPosts(6);
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-ink">Discover</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
        Everything Discaro tracks, in six shelves. Search the published listings, or browse by
        category.
      </p>
      <div className="mt-6">
        <SearchForm />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>

      {latest.length > 0 && (
        <section className="mt-14" aria-labelledby="discover-latest">
          <h2 id="discover-latest" className="text-2xl font-bold tracking-tight text-ink">
            Latest across Discaro
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <NewsletterCTA />
      </div>
    </main>
  );
}
