import { listPublishedPostOptions } from "@/lib/admin";
import OpportunityEditor from "@/components/admin/OpportunityEditor";

export const instant = false;

export default async function NewOpportunityPage() {
  const postOptions = await listPublishedPostOptions();
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">New opportunity</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Only add programmes you have verified against the official source — that is the whole
        promise of the directory.
      </p>
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
        <OpportunityEditor opportunity={null} postOptions={postOptions} />
      </div>
    </main>
  );
}
