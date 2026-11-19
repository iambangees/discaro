import { cacheLife } from "next/cache";
import { getSupabase } from "./supabase";

/*
  Discaro data layer — every read goes through here.
  All functions are failure-tolerant: if Supabase is unconfigured or a
  query errors, they return empty results and the pages render their
  honest empty states instead of breaking.
*/

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured: boolean;
  trending_score: number;
  affiliate: boolean;
  cover_image_url: string | null;
  published_at: string | null;
  category: { slug: string; name: string } | null;
}

export interface PostFull extends PostSummary {
  body: string;
  category_id: string | null;
  updated_at: string;
}

/**
 * Cached clock. Next 16 prerendering forbids reading the current time
 * during a page's static shell render, so every "now" the public data
 * layer needs comes through here (refreshed at most once a minute).
 */
export async function getNowMs(): Promise<number> {
  "use cache";
  cacheLife({ revalidate: 60 });
  return Date.now();
}

/** Posts the public may read: published, plus scheduled whose time has come. */
async function publishedOr(): Promise<string> {
  const nowIso = new Date(await getNowMs()).toISOString();
  return `status.eq.published,and(status.eq.scheduled,published_at.lte.${nowIso})`;
}

const SUMMARY_COLS =
  "id,slug,title,excerpt,featured,trending_score,affiliate,cover_image_url,published_at,category:categories(slug,name)";

type Rows<T> = { data: T[] | null; error: unknown };

async function run<T>(fn: () => Promise<Rows<T>>): Promise<T[]> {
  try {
    const { data, error } = await fn();
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedPosts(limit = 3): Promise<PostSummary[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const pubOr = await publishedOr();
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .or(pubOr)
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export async function getTrendingPosts(limit = 5): Promise<PostSummary[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const pubOr = await publishedOr();
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .or(pubOr)
      .order("trending_score", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export async function getLatestPosts(limit = 6): Promise<PostSummary[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const pubOr = await publishedOr();
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .or(pubOr)
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const pubOr = await publishedOr();
  try {
    const { data, error } = await sb
      .from("posts")
      .select(`${SUMMARY_COLS},body,category_id,updated_at`)
      .or(pubOr)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return data as unknown as PostFull;
  } catch {
    return null;
  }
}

export async function getRelatedPosts(post: PostFull, limit = 3): Promise<PostSummary[]> {
  const sb = getSupabase();
  if (!sb || !post.category_id) return [];
  const pubOr = await publishedOr();
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .or(pubOr)
      .eq("category_id", post.category_id)
      .neq("id", post.id)
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export interface CategoryPage {
  posts: PostSummary[];
  total: number;
}

export async function getPostsByCategory(
  categorySlug: string,
  page = 1,
  pageSize = 9,
): Promise<CategoryPage> {
  const sb = getSupabase();
  if (!sb) return { posts: [], total: 0 };
  try {
    const { data: cat, error: catError } = await sb
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (catError || !cat) return { posts: [], total: 0 };
    const from = (page - 1) * pageSize;
    const pubOr = await publishedOr();
    const { data, error, count } = await sb
      .from("posts")
      .select(SUMMARY_COLS, { count: "exact" })
      .or(pubOr)
      .eq("category_id", cat.id)
      .order("published_at", { ascending: false })
      .range(from, from + pageSize - 1);
    if (error) return { posts: [], total: 0 };
    return { posts: (data ?? []) as unknown as PostSummary[], total: count ?? 0 };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function searchPosts(rawQuery: string, limit = 24): Promise<PostSummary[]> {
  const sb = getSupabase();
  if (!sb) return [];
  // Strip characters that would break the PostgREST filter grammar.
  const term = rawQuery.replace(/[^a-zA-Z0-9\s'-]/g, " ").trim();
  if (!term) return [];
  const pubOr = await publishedOr();
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .or(pubOr)
      .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`)
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

/** Fetch specific posts by id (used for a member's bookmark list). */
export async function getPostsByIds(ids: string[]): Promise<PostSummary[]> {
  if (ids.length === 0) return [];
  const sb = getSupabase();
  if (!sb) return [];
  const orFilter = await publishedOr();
  const rows = await run<PostSummary>(() =>
    sb.from("posts").select(SUMMARY_COLS).in("id", ids).or(orFilter) as unknown as Promise<
      Rows<PostSummary>
    >,
  );
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as PostSummary[];
}

/** Fetch specific opportunities by id (used for a member's bookmark list). */
export async function getOpportunitiesByIds(ids: string[]): Promise<Opportunity[]> {
  if (ids.length === 0) return [];
  const sb = getSupabase();
  if (!sb) return [];
  const rows = await run<Opportunity>(() =>
    sb.from("opportunities").select(OPP_COLS).in("id", ids) as unknown as Promise<
      Rows<Opportunity>
    >,
  );
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as Opportunity[];
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/* Opportunity directory (Phase 3)                                     */
/* ------------------------------------------------------------------ */

export type OpportunityStatus = "active" | "upcoming" | "expired" | "paused";

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  organisation: string;
  summary: string;
  requirements: string;
  reward_info: string;
  official_url: string;
  source_url: string | null;
  status: OpportunityStatus;
  opens_at: string | null;
  expires_at: string | null;
  last_verified_at: string | null;
  related_post_id: string | null;
  eligibility: { region: string; notes: string }[];
}

const OPP_COLS =
  "id,slug,title,organisation,summary,requirements,reward_info,official_url,source_url,status,opens_at,expires_at,last_verified_at,related_post_id,eligibility(region,notes)";

/** The status a visitor should see: dates can move a listing on their own. */
export function effectiveStatus(
  o: Opportunity,
  now: number = Date.now(),
): "active" | "upcoming" | "expired" | "paused" {
  if (o.status === "active" && o.expires_at && new Date(o.expires_at).getTime() < now) {
    return "expired";
  }
  if (o.status === "upcoming" && o.opens_at && new Date(o.opens_at).getTime() <= now) {
    return "active";
  }
  return o.status;
}

const STATUS_RANK: Record<string, number> = { active: 0, upcoming: 1, expired: 2, paused: 3 };

export interface OpportunityQuery {
  status?: string;
  region?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface OpportunityPage {
  items: Opportunity[];
  total: number;
}

export async function getOpportunities(query: OpportunityQuery = {}): Promise<OpportunityPage> {
  const sb = getSupabase();
  if (!sb) return { items: [], total: 0 };
  const page = Math.max(1, query.page ?? 1);
  const pageSize = query.pageSize ?? 12;
  try {
    let builder = sb
      .from("opportunities")
      .select(query.region ? OPP_COLS.replace("eligibility(region,notes)", "eligibility!inner(region,notes)") : OPP_COLS)
      .neq("status", "paused")
      .limit(200);
    if (query.region) builder = builder.eq("eligibility.region", query.region);
    const term = (query.q ?? "").replace(/[^a-zA-Z0-9\s'-]/g, " ").trim();
    if (term) {
      builder = builder.or(
        `title.ilike.%${term}%,organisation.ilike.%${term}%,summary.ilike.%${term}%`,
      );
    }
    const { data, error } = await builder;
    if (error) return { items: [], total: 0 };
    let items = (data ?? []) as unknown as Opportunity[];
    const now = await getNowMs();
    if (query.status) {
      items = items.filter((o) => effectiveStatus(o, now) === query.status);
    }
    items.sort((a, b) => {
      const rank = STATUS_RANK[effectiveStatus(a, now)] - STATUS_RANK[effectiveStatus(b, now)];
      if (rank !== 0) return rank;
      const ae = a.expires_at ? new Date(a.expires_at).getTime() : Number.POSITIVE_INFINITY;
      const be = b.expires_at ? new Date(b.expires_at).getTime() : Number.POSITIVE_INFINITY;
      return ae - be;
    });
    const total = items.length;
    const from = (page - 1) * pageSize;
    return { items: items.slice(from, from + pageSize), total };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getOpportunityRegions(): Promise<string[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const rows = await run<{ region: string }>(() =>
    sb.from("eligibility").select("region").limit(500) as unknown as Promise<Rows<{ region: string }>>,
  );
  return [...new Set(rows.map((r) => r.region))].sort();
}

export async function getOpportunityBySlug(
  slug: string,
): Promise<{ opportunity: Opportunity; relatedPost: { slug: string; title: string } | null } | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("opportunities")
      .select(OPP_COLS)
      .eq("slug", slug)
      .neq("status", "paused")
      .maybeSingle();
    if (error || !data) return null;
    const opportunity = data as unknown as Opportunity;
    let relatedPost: { slug: string; title: string } | null = null;
    if (opportunity.related_post_id) {
      const pubOr = await publishedOr();
      const { data: post } = await sb
        .from("posts")
        .select("slug,title")
        .eq("id", opportunity.related_post_id)
        .or(pubOr)
        .maybeSingle();
      if (post) relatedPost = post as { slug: string; title: string };
    }
    return { opportunity, relatedPost };
  } catch {
    return null;
  }
}

export async function countActiveOpportunities(): Promise<number> {
  const sb = getSupabase();
  if (!sb) return 0;
  try {
    const { count, error } = await sb
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .eq("status", "active");
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
