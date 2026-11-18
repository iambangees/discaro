import CategoryListing, { categoryMetadata } from "@/components/CategoryListing";
import { categoryBySlug } from "@/lib/site";

// Database-driven route: rendered per request, never prerendered.
export const instant = false;

const category = categoryBySlug("opportunities")!;


export const metadata = categoryMetadata(category);

/*
  Articles about opportunities live here from Phase 2. The opportunity
  directory itself (eligibility, expiry, official links) is Phase 3 and
  gets its own routes — the homepage band already explains it.
*/
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  return <CategoryListing category={category} page={Number(page) || 1} />;
}
