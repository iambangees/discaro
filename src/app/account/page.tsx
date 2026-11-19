import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import { getCurrentUser, getMyBookmarks } from "@/lib/account";
import PostCard from "@/components/PostCard";
import OpportunityCard from "@/components/OpportunityCard";
import SignOutButton from "@/components/SignOutButton";

export const instant = false;

export const metadata: Metadata = {
  title: "My bookmarks",
  description: "Your saved Discaro articles and opportunities.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const { posts, opportunities } = await getMyBookmarks(user.id);
  const empty = posts.length === 0 && opportunities.length === 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Hello, {user.displayName}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Signed in as {user.email}. Everything you save lives here.
          </p>
        </div>
        <SignOutButton />
      </div>

      {empty ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-surface p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
            <Bookmark className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-bold text-ink">Nothing saved yet</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
            Tap the bookmark icon on any article or opportunity and it will wait for you here —
            handy for deadlines you are not ready to apply to yet.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/opportunities"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
            >
              Browse opportunities
            </Link>
            <Link
              href="/discover"
              className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent-deep"
            >
              Read articles
            </Link>
          </div>
        </div>
      ) : (
        <>
          {opportunities.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-ink">Saved opportunities</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {opportunities.map((o) => (
                  <OpportunityCard key={o.id} opportunity={o} />
                ))}
              </div>
            </section>
          )}
          {posts.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold tracking-tight text-ink">Saved articles</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
