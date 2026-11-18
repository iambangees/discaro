import Link from "next/link";
import { listReports } from "@/lib/admin";
import { formatDate } from "@/lib/data";
import { setReportStatus } from "../actions";

export const instant = false;

export default async function AdminReportsPage() {
  const reports = await listReports();
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Reports</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Visitor reports about expired or broken listings. Re-check the listing against its
        official source, fix it if needed, then mark the report reviewed.
      </p>
      {reports.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No reports yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline gap-2">
                {r.opportunity ? (
                  <Link href={`/admin/opportunities`} className="font-semibold text-ink hover:text-accent-deep">
                    {r.opportunity.title}
                  </Link>
                ) : r.post ? (
                  <span className="font-semibold text-ink">{r.post.title} (article)</span>
                ) : (
                  <span className="font-semibold text-ink">Listing removed</span>
                )}
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  r.status === "open" ? "bg-amber-100 text-amber-800" : "bg-zinc-200 text-zinc-600"
                }`}>
                  {r.status}
                </span>
                <span className="ml-auto text-xs font-medium text-muted">{formatDate(r.created_at)}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {r.reason || "(no details given)"}
              </p>
              {r.status === "open" && (
                <div className="mt-3 flex gap-2">
                  <form action={setReportStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="reviewed" />
                    <button type="submit" className="rounded-lg bg-ink px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-deep">
                      Mark reviewed
                    </button>
                  </form>
                  <form action={setReportStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="dismissed" />
                    <button type="submit" className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:border-accent/50">
                      Dismiss
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
