import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CircleAlert,
  Globe2,
  ListChecks,
  Trophy,
} from "lucide-react";
import { effectiveStatus, formatDate, getOpportunityBySlug } from "@/lib/data";
import { STATUS_STYLES } from "@/components/OpportunityCard";
import ReportForm from "@/components/ReportForm";

// Database-driven route: rendered per request, never prerendered.
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getOpportunityBySlug(slug);
  if (!found) return { title: "Opportunity not found" };
  const url = `/opportunities/${found.opportunity.slug}`;
  return {
    title: found.opportunity.title,
    description: found.opportunity.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: found.opportunity.title,
      description: found.opportunity.summary,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: found.opportunity.title,
      description: found.opportunity.summary,
    },
  };
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getOpportunityBySlug(slug);
  if (!found) notFound();
  const { opportunity: o, relatedPost } = found;
  const status = effectiveStatus(o);
  const style = STATUS_STYLES[status];
  const closed = status === "expired";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All opportunities
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className={`rounded-full px-2.5 py-1 ${style.badge}`}>{style.label}</span>
        {o.last_verified_at && (
          <span className="inline-flex items-center gap-1 text-muted">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified {formatDate(o.last_verified_at)}
          </span>
        )}
      </div>
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">{o.title}</h1>
      {o.organisation && <p className="mt-2 text-lg font-medium text-ink-soft">{o.organisation}</p>}
      {o.summary && <p className="mt-4 text-base leading-relaxed text-ink-soft">{o.summary}</p>}

      {closed && (
        <p className="mt-6 flex gap-2.5 rounded-2xl border border-zinc-300 bg-zinc-100 p-4 text-sm leading-relaxed text-zinc-800">
          <CircleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden />
          <span>
            <strong>This opportunity has closed.</strong> It stays listed so you can see it is over —
            please don't spend time applying. Browse the directory for programmes that are open now.
          </span>
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-3xl border border-line bg-surface p-6" aria-labelledby="opp-dates">
          <h2 id="opp-dates" className="flex items-center gap-2 font-bold tracking-tight text-ink">
            <CalendarClock className="h-5 w-5 text-accent" aria-hidden /> Key dates
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            {o.opens_at && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Opens</dt>
                <dd className="font-semibold text-ink">{formatDate(o.opens_at)}</dd>
              </div>
            )}
            {o.expires_at && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{closed ? "Closed" : "Closes"}</dt>
                <dd className="font-semibold text-ink">{formatDate(o.expires_at)}</dd>
              </div>
            )}
            {o.last_verified_at && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Last verified</dt>
                <dd className="font-semibold text-ink">{formatDate(o.last_verified_at)}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6" aria-labelledby="opp-eligibility">
          <h2 id="opp-eligibility" className="flex items-center gap-2 font-bold tracking-tight text-ink">
            <Globe2 className="h-5 w-5 text-accent" aria-hidden /> Who can apply
          </h2>
          {o.eligibility.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Eligibility details are on the official page — check them before applying.
            </p>
          ) : (
            <ul className="mt-3 space-y-2.5 text-sm">
              {o.eligibility.map((e) => (
                <li key={e.region}>
                  <span className="font-semibold text-ink">{e.region}</span>
                  {e.notes && <span className="block leading-relaxed text-muted">{e.notes}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {o.reward_info && (
        <section className="mt-4 rounded-3xl border border-line bg-surface p-6" aria-labelledby="opp-reward">
          <h2 id="opp-reward" className="flex items-center gap-2 font-bold tracking-tight text-ink">
            <Trophy className="h-5 w-5 text-accent" aria-hidden /> What you get
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{o.reward_info}</p>
        </section>
      )}

      {o.requirements && (
        <section className="mt-4 rounded-3xl border border-line bg-surface p-6" aria-labelledby="opp-req">
          <h2 id="opp-req" className="flex items-center gap-2 font-bold tracking-tight text-ink">
            <ListChecks className="h-5 w-5 text-accent" aria-hidden /> Requirements
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{o.requirements}</p>
        </section>
      )}

      {!closed && (
        <div className="mt-8">
          <a
            href={o.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Apply on the official site <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Applications happen on the official site. Discaro never asks for your personal details
            or payment to apply for an opportunity — if a page does, it is not us and probably not
            the real programme either.
          </p>
        </div>
      )}

      {o.source_url && (
        <p className="mt-6 text-sm text-muted">
          Verified from:{" "}
          <a href={o.source_url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-deep underline">
            the official source
          </a>
        </p>
      )}

      {relatedPost && (
        <p className="mt-4 text-sm text-muted">
          Related reading:{" "}
          <Link href={`/articles/${relatedPost.slug}`} className="font-medium text-accent-deep underline">
            {relatedPost.title}
          </Link>
        </p>
      )}

      <div className="mt-10">
        <ReportForm opportunityId={o.id} />
      </div>
    </main>
  );
}
