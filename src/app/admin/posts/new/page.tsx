import { CATEGORIES } from "@/lib/site";
import { listDbCategories } from "@/lib/admin";
import PostEditor from "@/components/admin/PostEditor";

export const instant = false;

export default async function NewPostPage() {
  const dbCats = await listDbCategories();
  const categories = CATEGORIES.map((c) => ({
    ...c,
    dbId: dbCats.find((d) => d.slug === c.slug)?.id,
  }));
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">New article</h1>
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
        <PostEditor post={null} categories={categories} />
      </div>
    </main>
  );
}
