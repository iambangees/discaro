import { getServerSupabase } from "./supabase-server";
import type { Opportunity, PostSummary } from "./data";

/*
  Admin-side reads. Everything goes through the session client, so the
  RLS "admins manage …" policies (supabase/phase4.sql) decide what is
  visible — a signed-in non-admin sees nothing here.
*/

export interface AdminContext {
  email: string;
  isAdmin: boolean;
}

export async function getAdminContext(): Promise<AdminContext | null> {
  const sb = await getServerSupabase();
  if (!sb) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return { email: user.email ?? "", isAdmin: Boolean(data) };
}

export interface AdminPost extends PostSummary {
  body: string;
  status: string;
  category_id: string | null;
  updated_at: string;
  tags: string[];
}

export async function listAllPosts(): Promise<AdminPost[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("posts")
    .select("*,category:categories(slug,name)")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((r) => ({ ...r, tags: [] }) as unknown as AdminPost);
}

export async function getPostForEdit(id: string): Promise<AdminPost | null> {
  const sb = await getServerSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from("posts").select("*,category:categories(slug,name)").eq("id", id).maybeSingle();
  if (error || !data) return null;
  const { data: tagRows } = await sb
    .from("post_tags")
    .select("tag:tags(name)")
    .eq("post_id", id);
  const tags = ((tagRows ?? []) as unknown as { tag: { name: string } | null }[])
    .map((r) => r.tag?.name)
    .filter((t): t is string => Boolean(t));
  return { ...(data as Record<string, unknown>), tags } as unknown as AdminPost;
}

export async function listAllOpportunities(): Promise<Opportunity[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("opportunities")
    .select("*,eligibility(region,notes)")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data as unknown as Opportunity[];
}

export async function getOpportunityForEdit(id: string): Promise<Opportunity | null> {
  const sb = await getServerSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("opportunities")
    .select("*,eligibility(region,notes)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as Opportunity;
}

export interface AdminReport {
  id: string;
  reason: string;
  status: string;
  created_at: string;
  opportunity: { title: string; slug: string } | null;
  post: { title: string; slug: string } | null;
}

export async function listReports(): Promise<AdminReport[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("reports")
    .select("id,reason,status,created_at,opportunity:opportunities(title,slug),post:posts(title,slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data as unknown as AdminReport[];
}

export interface AdminComment {
  id: string;
  body: string;
  status: string;
  created_at: string;
  post: { title: string; slug: string } | null;
  author: { display_name: string } | null;
}

/** Moderation queue: pending first, then newest first within a status. */
export async function listComments(): Promise<AdminComment[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("comments")
    .select("id,body,status,created_at,post:posts(title,slug),author:profiles(display_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  const rank = (s: string) => (s === "pending" ? 0 : s === "approved" ? 1 : 2);
  return (data as unknown as AdminComment[]).sort((a, b) => rank(a.status) - rank(b.status));
}

export interface AdminSubmission {
  id: string;
  title: string;
  organisation: string;
  official_url: string;
  summary: string;
  reward_info: string;
  expires_at: string | null;
  status: string;
  created_at: string;
  created_opportunity_id: string | null;
  author: { display_name: string } | null;
}

/** Submission review queue: pending first, then newest first. */
export async function listSubmissions(): Promise<AdminSubmission[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("submissions")
    .select(
      "id,title,organisation,official_url,summary,reward_info,expires_at,status,created_at,created_opportunity_id,author:profiles(display_name)"
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  const rank = (s: string) => (s === "pending" ? 0 : s === "approved" ? 1 : 2);
  return (data as unknown as AdminSubmission[]).sort((a, b) => rank(a.status) - rank(b.status));
}

export interface AffiliateLinkRow {
  id: string;
  label: string;
  url: string;
  merchant: string;
  active: boolean;
  created_at: string;
  clicks: number;
}

/** Affiliate links with their /go click counts (admin view). */
export async function listAffiliateLinks(): Promise<AffiliateLinkRow[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("affiliate_links")
    .select("id,label,url,merchant,active,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  const { data: clickRows } = await sb
    .from("affiliate_clicks")
    .select("link_id")
    .limit(10000);
  const tally = new Map<string, number>();
  for (const r of (clickRows ?? []) as { link_id: string }[]) {
    tally.set(r.link_id, (tally.get(r.link_id) ?? 0) + 1);
  }
  return (data as Omit<AffiliateLinkRow, "clicks">[]).map((l) => ({
    ...l,
    clicks: tally.get(l.id) ?? 0,
  }));
}

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("newsletter_subscribers")
    .select("id,email,confirmed,created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return data as Subscriber[];
}

export interface TagRow {
  id: string;
  name: string;
  slug: string;
}

export async function listTags(): Promise<TagRow[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("tags").select("id,name,slug").order("name");
  if (error || !data) return [];
  return data as TagRow[];
}

export async function dashboardCounts() {
  const sb = await getServerSupabase();
  const empty = { posts: 0, drafts: 0, opportunities: 0, openReports: 0, subscribers: 0, pendingComments: 0, pendingSubmissions: 0 };
  if (!sb) return empty;
  const total = async (table: string) => {
    const { count } = await sb.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  };
  const filtered = async (table: string, column: string, value: string) => {
    const { count } = await sb
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq(column, value);
    return count ?? 0;
  };
  const [posts, drafts, opportunities, openReports, subscribers, pendingComments, pendingSubmissions] = await Promise.all([
    total("posts"),
    filtered("posts", "status", "draft"),
    total("opportunities"),
    filtered("reports", "status", "open"),
    total("newsletter_subscribers"),
    filtered("comments", "status", "pending"),
    filtered("submissions", "status", "pending"),
  ]);
  return { posts, drafts, opportunities, openReports, subscribers, pendingComments, pendingSubmissions };
}

export async function listDbCategories(): Promise<{ id: string; slug: string; name: string }[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("categories").select("id,slug,name").order("name");
  if (error || !data) return [];
  return data as { id: string; slug: string; name: string }[];
}

export async function listPublishedPostOptions(): Promise<{ id: string; title: string }[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("posts")
    .select("id,title")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data as { id: string; title: string }[];
}
