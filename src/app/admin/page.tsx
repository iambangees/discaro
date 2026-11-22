import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dashboardCounts, listAllPosts } from "@/lib/admin";
import { formatDate } from "@/lib/data";

export const instant = false;

export default async function AdminDashboard() {
  const [counts, posts] = await Promise.all([dashboardCounts(), listAllPosts()]);
  const cards = [
    { label: "Articles (all)", value: counts.posts, href: "/admin/posts" },
    { label: "Drafts", value: counts.drafts, href: "/admin/posts" },
    { label: "Opportunities", value: counts.opportunities, href: "/admin/opportunities" },
    { label: "Open reports", value: counts.openReports, href: "/admin/reports" },
    { label: "Comments to moderate", value: counts.pendingComments, href: "/admin/comments" },
    { label: "Submissions to review", value: counts.pendingSubmissions, href: "/admin/submissions" },
    { label: "Subscribers", value: counts.subscribers, href: "/admin/subscribers" },
  ];
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-3xl border border-line bg-surface p-5 transition-colors hover:border-accent/50"
          >
            <p className="text-3xl font-bold tracking-tight text-ink">{c.value}</p>
            <p className="mt-1 text-sm font-medium text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/posts/new" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-deep">
          New article <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="/admin/opportunities/new" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink hover:border-accent/50 hover:text-accent-deep">
          New opportunity <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <h2 className="mt-10 text-xl font-bold tracking-tight text-ink">Recently updated articles</h2>
      {posts.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No articles yet — write the first one.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-3xl border border-line bg-surface">
          {posts.slice(0, 5).map((p) => (
            <li key={p.id}>
              <Link href={`/admin/posts/${p.id}`} className="flex items-baseline gap-3 px-5 py-3.5 hover:bg-accent-soft/50">
                <span className="font-semibold text-ink">{p.title}</span>
                <span className="ml-auto shrink-0 text-xs font-medium text-muted">
                  {p.status} · {formatDate(p.updated_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
