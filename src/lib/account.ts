import { getServerSupabase } from "@/lib/supabase-server";
import { getOpportunitiesByIds, getPostsByIds, type Opportunity, type PostSummary } from "@/lib/data";

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
}

/** The signed-in visitor (Supabase Auth), or null when signed out. */
export async function getCurrentUser(): Promise<AccountUser | null> {
  const sb = await getServerSupabase();
  if (!sb) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  let displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Reader";
  const { data: profile } = await sb
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.display_name) displayName = profile.display_name;
  return { id: user.id, email: user.email ?? "", displayName };
}

export interface MyBookmarks {
  posts: PostSummary[];
  opportunities: Opportunity[];
}

/** The visitor's bookmarked content, most recently saved first. */
export async function getMyBookmarks(userId: string): Promise<MyBookmarks> {
  const sb = await getServerSupabase();
  if (!sb) return { posts: [], opportunities: [] };
  const { data: rows } = await sb
    .from("bookmarks")
    .select("post_id,opportunity_id,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  const postIds = (rows ?? []).map((r) => r.post_id).filter(Boolean) as string[];
  const oppIds = (rows ?? []).map((r) => r.opportunity_id).filter(Boolean) as string[];
  const [posts, opportunities] = await Promise.all([
    getPostsByIds(postIds),
    getOpportunitiesByIds(oppIds),
  ]);
  return { posts, opportunities };
}

export interface MySubmission {
  id: string;
  title: string;
  organisation: string;
  status: string;
  created_at: string;
}

/** The visitor's own opportunity suggestions, newest first. */
export async function getMySubmissions(userId: string): Promise<MySubmission[]> {
  const sb = await getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("submissions")
    .select("id,title,organisation,status,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data as MySubmission[];
}
