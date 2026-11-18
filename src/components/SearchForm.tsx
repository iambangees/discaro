import { Search } from "lucide-react";

/** Plain GET form — search works without any client JavaScript. */
export default function SearchForm({
  initialQuery = "",
  autoFocus = false,
}: {
  initialQuery?: string;
  autoFocus?: boolean;
}) {
  return (
    <form action="/search" method="get" role="search" className="flex w-full max-w-xl gap-2">
      <label htmlFor="site-search" className="sr-only">
        Search Discaro
      </label>
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          id="site-search"
          name="q"
          type="search"
          defaultValue={initialQuery}
          autoFocus={autoFocus}
          placeholder="Search freebies, tools, tutorials, opportunities…"
          className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
      >
        Search
      </button>
    </form>
  );
}
