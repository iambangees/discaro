import Link from "next/link";
import { listSubmissions } from "@/lib/admin";
import { formatDate } from "@/lib/data";
import { approveSubmission, deleteSubmission, rejectSubmission } from "../actions";

export const instant = false;

const CHIP: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-zinc-200 text-zinc-600",
};

const BTN = "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors";
const BTN_SOLID = `${BTN} bg-ink text-white hover:bg-accent-deep`;
const BTN_LINE = `${BTN} border border-line text-ink hover:border-accent/50`;
const BTN_DANGER = `${BTN} border border-red-200 text-red-700 hover:border-red-400`;

export default async function AdminSubmissionsPage() {
  const submissions = await listSubmissions();
  const pending = submissions.filter((s) => s.status === "pending").length;
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Submissions</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Opportunities suggested by visitors. <strong>Approve &amp; convert</strong> creates a{" "}
        <em>paused</em> (hidden) listing prefilled with the suggestion — verify it against the
        official source, add eligibility, then activate it in the opportunity editor. Nothing
        is ever published straight from a suggestion.
        {pending > 0 ? ` ${pending} awaiting review.` : ""}
      </p>
      {submissions.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No submissions yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {submissions.map((s) => (
            <li key={s.id} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-ink">{s.title}</span>
                {s.organisation && <span className="text-sm text-muted">· {s.organisation}</span>}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CHIP[s.status] ?? CHIP.rejected}`}
                >
                  {s.status}
                </span>
                <span className="ml-auto text-xs font-medium text-muted">
                  suggested by {s.author?.display_name || "Reader"} · {formatDate(s.created_at)}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {s.summary}
              </p>
              <dl className="mt-3 space-y-1 text-sm text-ink-soft">
                {s.reward_info && (
                  <p>
                    <span className="font-semibold text-ink">What you get:</span> {s.reward_info}
                  </p>
                )}
                {s.expires_at && (
                  <p>
                    <span className="font-semibold text-ink">Closes:</span>{" "}
                    {formatDate(s.expires_at)}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-ink">Official link:</span>{" "}
                  <a
                    href={s.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-medium text-accent-deep underline"
                  >
                    {s.official_url}
                  </a>
                </p>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.status !== "approved" && (
                  <form action={approveSubmission}>
                    <input type="hidden" name="id" value={s.id} />
                    <button type="submit" className={BTN_SOLID}>
                      Approve &amp; convert
                    </button>
                  </form>
                )}
                {s.status === "approved" && s.created_opportunity_id && (
                  <Link href={`/admin/opportunities/${s.created_opportunity_id}`} className={BTN_SOLID}>
                    Edit the listing
                  </Link>
                )}
                {s.status !== "rejected" && s.status !== "approved" && (
                  <form action={rejectSubmission}>
                    <input type="hidden" name="id" value={s.id} />
                    <button type="submit" className={BTN_LINE}>
                      Reject
                    </button>
                  </form>
                )}
                <form action={deleteSubmission}>
                  <input type="hidden" name="id" value={s.id} />
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
