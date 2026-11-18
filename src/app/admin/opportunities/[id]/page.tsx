import { notFound } from "next/navigation";
import { getOpportunityForEdit, listPublishedPostOptions } from "@/lib/admin";
import OpportunityEditor from "@/components/admin/OpportunityEditor";

export const instant = false;

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [opportunity, postOptions] = await Promise.all([
    getOpportunityForEdit(id),
    listPublishedPostOptions(),
  ]);
  if (!opportunity) notFound();
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Edit opportunity</h1>
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
        <OpportunityEditor opportunity={opportunity} postOptions={postOptions} />
      </div>
    </main>
  );
}
