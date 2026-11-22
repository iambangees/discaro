import Link from "next/link";
import { listComments } from "@/lib/admin";
import { formatDate } from "@/lib/data";
import { deleteComment, setCommentStatus } from "../actions";

export const instant = false;

const CHIP: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-zinc-200 text-zinc-600",
};

const BTN =
  "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors";
const BTN_SOLID = `${BTN} bg-ink text-white hover:bg-accent-deep`;
const BTN_LINE = `${BTN} border border-line text-ink hover:border-accent/50`;
const BTN_DANGER = `${BTN} border border-red-200 text-red-700 hover:border-red-400`;

export default async function AdminCommentsPage() {
  const comments = await listComments();
  const pending = comments.filter((c) => c.status === "pending").length;
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Comments</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Visitor comments wait here until you approve them — nothing goes public on its own.
        {pending > 0 ? ` ${pending} awaiting moderation.` : ""}
      </p>
      {comments.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No comments yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-ink">
                  {c.author?.display_name || "Reader"}
                </span>
                <span className="text-sm text-muted">on</span>
                {c.post ? (
                  <Link
                    href={`/articles/${c.post.slug}`}
                    className="font-semibold text-ink hover:text-accent-deep"
                  >
                    {c.post.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-ink">Article removed</span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CHIP[c.status] ?? CHIP.rejected}`}
                >
                  {c.status}
                </span>
                <span className="ml-auto text-xs font-medium text-muted">
                  {formatDate(c.created_at)}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {c.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.status !== "approved" && (
                  <form action={setCommentStatus}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button type="submit" className={BTN_SOLID}>
                      Approve
                    </button>
                  </form>
                )}
                {c.status !== "rejected" && (
                  <form action={setCommentStatus}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button type="submit" className={BTN_LINE}>
                      Reject
                    </button>
                  </form>
                )}
                <form action={deleteComment}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className={BTN_DANGER}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
