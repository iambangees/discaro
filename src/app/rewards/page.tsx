import CategoryListing, { categoryMetadata } from "@/components/CategoryListing";
import { categoryBySlug } from "@/lib/site";

// Database-driven route: rendered per request, never prerendered.
export const instant = false;

const category = categoryBySlug("rewards")!;


export const metadata = categoryMetadata(category);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  return <CategoryListing category={category} page={Number(page) || 1} />;
}
