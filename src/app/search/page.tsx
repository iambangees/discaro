import type { Metadata } from "next";
import { searchPosts } from "@/lib/data";
import PostCard from "@/components/PostCard";
import SearchForm from "@/components/SearchForm";

// Database-driven route: rendered per request, never prerendered.
export const instant = false;


export const metadata: Metadata = {
  title: "Search",
  description: "Search Discaro's verified freebies, rewards, technology, tutorials, opportunities and reviews.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchPosts(query) : [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-ink">Search</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
        Search everything published on Discaro — every result is a listing a person checked first.
      </p>
      <div className="mt-6">
        <SearchForm initialQuery={query} autoFocus={!query} />
      </div>

      {query && (
        <p className="mt-8 text-sm font-medium text-muted" role="status">
          {results.length === 0
            ? `No results for "${query}" yet.`
            : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
        </p>
      )}

      {query && results.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-surface px-6 py-10 text-center">
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            Discaro only lists things it has verified, so the shelves are still filling up. Try a
            shorter or more general word — or browse the categories from the Discover page.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </main>
  );
}
