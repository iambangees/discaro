import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllPosts } from "@/lib/admin";
import { formatDate } from "@/lib/data";
import { deletePost } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const instant = false;

const STATUS_BADGE: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800",
  draft: "bg-zinc-200 text-zinc-700",
  scheduled: "bg-accent-soft text-accent-deep",
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const posts = await listAllPosts();
  return (
    <main>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Articles</h1>
        <Link href="/admin/posts/new" className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep">
          <Plus className="h-4 w-4" aria-hidden /> New article
        </Link>
      </div>
      {saved && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900" role="status">
          Saved.
        </p>
      )}
      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No articles yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
                <th className="px-5 py-3 font-semibold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3.5 font-semibold text-ink">
                    <Link href={`/admin/posts/${p.id}`} className="hover:text-accent-deep">{p.title}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{p.category?.name ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[p.status] ?? STATUS_BADGE.draft}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{formatDate(p.updated_at)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={p.id} />
                      <DeleteButton label="Delete" />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
