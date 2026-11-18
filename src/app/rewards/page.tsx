import CategoryShell, { categoryMetadata } from "@/components/CategoryShell";
import { categoryBySlug } from "@/lib/site";

const category = categoryBySlug("rewards")!;

export const metadata = categoryMetadata(category);

export default function Page() {
  return <CategoryShell category={category} />;
}
