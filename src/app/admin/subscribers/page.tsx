import { listSubscribers } from "@/lib/admin";
import { formatDate } from "@/lib/data";

export const instant = false;

export default async function AdminSubscribersPage() {
  const subscribers = await listSubscribers();
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Newsletter subscribers</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        People who asked for The Discaro Briefing. To write and send an issue, open the
        Newsletter tab.
      </p>
      {subscribers.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No subscribers yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Confirmed</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3.5 font-medium text-ink">{s.email}</td>
                  <td className="px-5 py-3.5 text-muted">{s.confirmed ? "Yes" : "Not yet"}</td>
                  <td className="px-5 py-3.5 text-muted">{formatDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
