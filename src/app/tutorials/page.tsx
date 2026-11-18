import CategoryShell, { categoryMetadata } from "@/components/CategoryShell";
import { categoryBySlug } from "@/lib/site";

const category = categoryBySlug("tutorials")!;

export const metadata = categoryMetadata(category);

export default function Page() {
  return <CategoryShell category={category} />;
}
