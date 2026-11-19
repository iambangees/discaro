import Link from "next/link";
import { CalendarClock, Globe2 } from "lucide-react";
import { effectiveStatus, formatDate, type Opportunity } from "@/lib/data";
import BookmarkButton from "@/components/BookmarkButton";

export const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  active: { badge: "bg-emerald-100 text-emerald-800", label: "Active" },
  upcoming: { badge: "bg-accent-soft text-accent-deep", label: "Upcoming" },
  expired: { badge: "bg-zinc-200 text-zinc-600", label: "Expired" },
  paused: { badge: "bg-amber-100 text-amber-800", label: "Paused" },
};

export default function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const status = effectiveStatus(opportunity);
  const style = STATUS_STYLES[status];
  const regions = opportunity.eligibility ?? [];
  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-accent/50">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className={`rounded-full px-2.5 py-1 ${style.badge}`}>{style.label}</span>
        {status === "active" && opportunity.expires_at && (
          <span className="inline-flex items-center gap-1 text-muted">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Closes {formatDate(opportunity.expires_at)}
          </span>
        )}
        {status === "upcoming" && opportunity.opens_at && (
          <span className="inline-flex items-center gap-1 text-muted">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Opens {formatDate(opportunity.opens_at)}
          </span>
        )}
        <span className="ml-auto">
          <BookmarkButton opportunityId={opportunity.id} />
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">
        <Link href={`/opportunities/${opportunity.slug}`} className="hover:text-accent-deep">
          {opportunity.title}
        </Link>
      </h3>
      {opportunity.organisation && (
        <p className="mt-1 text-sm font-medium text-ink-soft">{opportunity.organisation}</p>
      )}
      {opportunity.summary && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{opportunity.summary}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <Globe2 className="h-3.5 w-3.5" aria-hidden />
        {regions.length === 0 ? (
          <span>Eligibility on the listing</span>
        ) : (
          <>
            {regions.slice(0, 3).map((r) => (
              <span key={r.region} className="rounded-full border border-line px-2 py-0.5">
                {r.region}
              </span>
            ))}
            {regions.length > 3 && <span>+{regions.length - 3} more</span>}
          </>
        )}
      </div>
      {opportunity.last_verified_at && (
        <p className="mt-3 text-xs font-medium text-muted">
          Last verified {formatDate(opportunity.last_verified_at)}
        </p>
      )}
    </article>
  );
}
