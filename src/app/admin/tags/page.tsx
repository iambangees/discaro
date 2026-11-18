import { listTags } from "@/lib/admin";
import { deleteTag } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const instant = false;

export default async function AdminTagsPage() {
  const tags = await listTags();
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Tags</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Tags are created from the article editor (comma-separated). Categories are the site's
        fixed structure — the six shelves — and are managed in code, not here.
      </p>
      {tags.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No tags yet.</p>
      ) : (
        <ul className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.id} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-4 pr-2">
              <span className="text-sm font-medium text-ink">{t.name}</span>
              <form action={deleteTag}>
                <input type="hidden" name="id" value={t.id} />
                <DeleteButton label="✕" />
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
