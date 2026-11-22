"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminContext } from "@/lib/admin";

export interface ActionState {
  error?: string;
  saved?: boolean;
  message?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

async function requireAdmin() {
  const ctx = await getAdminContext();
  if (!ctx?.isAdmin) throw new Error("Not authorised");
  const sb = await getServerSupabase();
  if (!sb) throw new Error("Supabase is not configured");
  return sb;
}

function toIso(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/* ------------------------------ posts ------------------------------ */

export async function savePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let sb;
  try {
    sb = await requireAdmin();
  } catch {
    return { error: "You are not signed in as an admin." };
  }
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "A title is required." };
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const status = String(formData.get("status") ?? "draft");
  let publishedAt = toIso(formData.get("published_at"));
  if (status === "published" && !publishedAt) publishedAt = new Date().toISOString();

  const row = {
    title,
    slug,
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? ""),
    category_id: String(formData.get("category_id") ?? "") || null,
    status,
    featured: formData.get("featured") === "on",
    affiliate: formData.get("affiliate") === "on",
    trending_score: Number(formData.get("trending_score") ?? 0) || 0,
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  };

  let postId = id;
  if (id) {
    const { error } = await sb.from("posts").update(row).eq("id", id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const { data, error } = await sb.from("posts").insert(row).select("id").single();
    if (error) return { error: `Could not save: ${error.message}` };
    postId = data.id as string;
  }

  // Tags: upsert by slug, then re-link.
  const tagNames = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  await sb.from("post_tags").delete().eq("post_id", postId);
  for (const name of tagNames) {
    const tagSlug = slugify(name);
    if (!tagSlug) continue;
    const { data: tag } = await sb
      .from("tags")
      .upsert({ slug: tagSlug, name }, { onConflict: "slug" })
      .select("id")
      .single();
    if (tag) await sb.from("post_tags").insert({ post_id: postId, tag_id: tag.id });
  }

  revalidatePath("/");
  revalidatePath("/discover");
  redirect("/admin/posts?saved=1");
}

export async function deletePost(formData: FormData): Promise<void> {
  const sb = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await sb.from("posts").delete().eq("id", id);
  revalidatePath("/");
  redirect("/admin/posts?saved=1");
}

/* --------------------------- opportunities -------------------------- */

export async function saveOpportunity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let sb;
  try {
    sb = await requireAdmin();
  } catch {
    return { error: "You are not signed in as an admin." };
  }
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "A title is required." };
  const officialUrl = String(formData.get("official_url") ?? "").trim();
  if (!officialUrl) return { error: "The official application link is required — listings must point at the real programme." };
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);

  const row = {
    title,
    slug,
    organisation: String(formData.get("organisation") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    requirements: String(formData.get("requirements") ?? "").trim(),
    reward_info: String(formData.get("reward_info") ?? "").trim(),
    official_url: officialUrl,
    source_url: String(formData.get("source_url") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active"),
    opens_at: toIso(formData.get("opens_at")),
    expires_at: toIso(formData.get("expires_at")),
    last_verified_at: formData.get("verified_today") === "on"
      ? new Date().toISOString()
      : toIso(formData.get("last_verified_at")),
    related_post_id: String(formData.get("related_post_id") ?? "") || null,
    updated_at: new Date().toISOString(),
  };

  let oppId = id;
  if (id) {
    const { error } = await sb.from("opportunities").update(row).eq("id", id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const { data, error } = await sb.from("opportunities").insert(row).select("id").single();
    if (error) return { error: `Could not save: ${error.message}` };
    oppId = data.id as string;
  }

  // Eligibility rows arrive as JSON from the editor.
  let eligibility: { region: string; notes: string }[] = [];
  try {
    eligibility = JSON.parse(String(formData.get("eligibility_json") ?? "[]"));
  } catch {
    eligibility = [];
  }
  await sb.from("eligibility").delete().eq("opportunity_id", oppId);
  const rows = eligibility
    .filter((e) => e.region?.trim())
    .map((e) => ({ opportunity_id: oppId, region: e.region.trim(), notes: (e.notes ?? "").trim() }));
  if (rows.length) {
    const { error } = await sb.from("eligibility").insert(rows);
    if (error) return { error: `Saved, but eligibility failed: ${error.message}` };
  }

  revalidatePath("/opportunities");
  revalidatePath("/");
  redirect("/admin/opportunities?saved=1");
}

export async function deleteOpportunity(formData: FormData): Promise<void> {
  const sb = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await sb.from("opportunities").delete().eq("id", id);
  revalidatePath("/opportunities");
  redirect("/admin/opportunities?saved=1");
}

/* ------------------------------ reports ----------------------------- */

export async function setReportStatus(formData: FormData): Promise<void> {
  const sb = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "reviewed");
  if (id) await sb.from("reports").update({ status }).eq("id", id);
  redirect("/admin/reports");
}

/* ----------------------------- comments ----------------------------- */

export async function setCommentStatus(formData: FormData): Promise<void> {
  const sb = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "approved");
  if (id && (status === "approved" || status === "rejected" || status === "pending")) {
    await sb.from("comments").update({ status }).eq("id", id);
  }
  redirect("/admin/comments");
}

export async function deleteComment(formData: FormData): Promise<void> {
  const sb = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await sb.from("comments").delete().eq("id", id);
  redirect("/admin/comments");
}

export async function deleteTag(formData: FormData): Promise<void> {
  const sb = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await sb.from("tags").delete().eq("id", id);
  redirect("/admin/tags");
}

/* ------------------------------ session ----------------------------- */

export async function signOut(): Promise<void> {
  const sb = await getServerSupabase();
  if (sb) await sb.auth.signOut();
  redirect("/admin/login");
}


/* ---------------------------- newsletter ---------------------------- */

export async function sendNewsletterAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const { sendNewsletter } = await import("@/lib/newsletter");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (subject.length < 3) return { error: "Give the email a subject (at least 3 characters)." };
  if (body.length < 20) return { error: "The email body looks too short — write a little more." };
  const result = await sendNewsletter(subject, body);
  if (result.error) return { error: result.error };
  return { saved: true, message: `Sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}.` };
}
