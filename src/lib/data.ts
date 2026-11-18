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
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export async function getTrendingPosts(limit = 5): Promise<PostSummary[]> {
  const sb = getSupabase();
  if (!sb) return [];
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .eq("status", "published")
      .order("trending_score", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export async function getLatestPosts(limit = 6): Promise<PostSummary[]> {
  const sb = getSupabase();
  if (!sb) return [];
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("posts")
      .select(`${SUMMARY_COLS},body,category_id,updated_at`)
      .eq("status", "published")
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
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .eq("status", "published")
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
    const { data, error, count } = await sb
      .from("posts")
      .select(SUMMARY_COLS, { count: "exact" })
      .eq("status", "published")
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
  return run<PostSummary>(() =>
    sb
      .from("posts")
      .select(SUMMARY_COLS)
      .eq("status", "published")
      .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`)
      .order("published_at", { ascending: false })
      .limit(limit) as unknown as Promise<Rows<PostSummary>>,
  );
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
