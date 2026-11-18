import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllOpportunities } from "@/lib/admin";
import { effectiveStatus, formatDate } from "@/lib/data";
import { STATUS_STYLES } from "@/components/OpportunityCard";
import { deleteOpportunity } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const instant = false;

export default async function AdminOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const items = await listAllOpportunities();
  return (
    <main>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Opportunities</h1>
        <Link href="/admin/opportunities/new" className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep">
          <Plus className="h-4 w-4" aria-hidden /> New opportunity
        </Link>
      </div>
      {saved && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900" role="status">Saved.</p>
      )}
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No opportunities yet — add the first verified one.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Closes</th>
                <th className="px-5 py-3 font-semibold">Verified</th>
                <th className="px-5 py-3 font-semibold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((o) => {
                const st = effectiveStatus(o);
                return (
                  <tr key={o.id}>
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      <Link href={`/admin/opportunities/${o.id}`} className="hover:text-accent-deep">{o.title}</Link>
                      <span className="block text-xs font-medium text-muted">{o.organisation}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[st].badge}`}>
                        {STATUS_STYLES[st].label}
                        {o.status === "paused" ? " (stored: paused)" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{formatDate(o.expires_at) || "—"}</td>
                    <td className="px-5 py-3.5 text-muted">{formatDate(o.last_verified_at) || "—"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <form action={deleteOpportunity}>
                        <input type="hidden" name="id" value={o.id} />
                        <DeleteButton label="Delete" />
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
