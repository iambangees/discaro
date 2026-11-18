import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/site";
import { getPostForEdit, listDbCategories } from "@/lib/admin";
import PostEditor from "@/components/admin/PostEditor";

export const instant = false;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, dbCats] = await Promise.all([getPostForEdit(id), listDbCategories()]);
  if (!post) notFound();
  const categories = CATEGORIES.map((c) => ({
    ...c,
    dbId: dbCats.find((d) => d.slug === c.slug)?.id,
  }));
  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Edit article</h1>
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
        <PostEditor post={post} categories={categories} />
      </div>
    </main>
  );
}
