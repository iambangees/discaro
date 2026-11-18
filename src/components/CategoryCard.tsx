import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Coins, Cpu, Gift, Star, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = {
  freebies: Gift,
  rewards: Coins,
  technology: Cpu,
  tutorials: BookOpen,
  opportunities: Briefcase,
  reviews: Star,
};

export default function CategoryCard({ category }: { category: Category }) {
  const Icon = ICONS[category.slug] ?? BookOpen;
  return (
    <Link
      href={`/${category.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(10,26,51,0.05)] transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_10px_30px_rgba(11,107,255,0.10)]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
        <Icon className="h-5.5 w-5.5" aria-hidden />
      </span>
      <span className="mt-4 text-lg font-semibold tracking-tight text-ink">{category.name}</span>
      <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{category.blurb}</span>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Explore
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
