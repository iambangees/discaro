"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import type { ArticleComment } from "@/lib/data";

/** Same en-GB long format as data.ts formatDate (kept local so this
 *  client component does not pull the server data layer into the bundle). */
function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

interface OwnComment extends ArticleComment {
  status: string;
  own: true;
}

type Row = ArticleComment | OwnComment;

function isOwn(row: Row): row is OwnComment {
  return (row as OwnComment).own === true;
}

/**
 * Article comments. The approved list is rendered by the server and
 * passed in; this component adds the signed-in visitor's own comments
 * (including still-pending ones, badged as such) and the comment form.
 * New comments are inserted under RLS as "pending" — they become public
 * only when an admin approves them in /admin/comments.
 */
export default function Comments({
  postId,
  slug,
  initialComments,
}: {
  postId: string;
  slug: string;
  initialComments: ArticleComment[];
}) {
  const [own, setOwn] = useState<OwnComment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  // When Supabase is not configured there is nothing to resolve.
  const [ready, setReady] = useState(() => getBrowserSupabase() === null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setReady(true);
        return;
      }
      setUserId(user.id);
      const { data } = await sb
        .from("comments")
        .select("id,body,created_at,status,author:profiles(display_name)")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      const rows = ((data ?? []) as unknown as {
        id: string;
        body: string;
        created_at: string;
        status: string;
        author: { display_name: string } | null;
      }[]).map((r) => ({
        id: r.id,
        body: r.body,
        created_at: r.created_at,
        author_name: r.author?.display_name || "You",
        status: r.status,
        own: true as const,
      }));
      setOwn(rows);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  // Merge: server-approved list, with the visitor's own comments swapped
  // in (they carry the status badge) and own pending/rejected appended.
  const merged: Row[] = [
    ...initialComments.filter((c) => !own.some((o) => o.id === c.id)),
    ...own,
  ].sort((a, b) => a.created_at.localeCompare(b.created_at));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    const text = body.trim();
    if (!sb || !userId || !text || busy) return;
    setBusy(true);
    setError(null);
    const { data, error: insertError } = await sb
      .from("comments")
      .insert({ post_id: postId, user_id: userId, body: text })
      .select("id,body,created_at,status")
      .single();
    setBusy(false);
    if (insertError || !data) {
      setError("Your comment could not be posted. Please try again in a moment.");
      return;
    }
    const row = data as { id: string; body: string; created_at: string; status: string };
    setOwn((prev) => [
      ...prev,
      { id: row.id, body: row.body, created_at: row.created_at, author_name: "You", status: row.status, own: true },
    ]);
    setBody("");
    setNote("Thanks — your comment is with the moderators and will appear once approved.");
  }

  return (
    <section className="mt-14" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-2xl font-bold tracking-tight text-ink">
        Comments{merged.length > 0 ? ` (${merged.length})` : ""}
      </h2>

      {merged.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No comments yet — start the conversation.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {merged.map((c) => (
            <li key={c.id} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-ink">{c.author_name}</span>
                {isOwn(c) && c.status !== "approved" && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      c.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {c.status === "pending" ? "Awaiting moderation" : "Not approved"}
                  </span>
                )}
                <span className="ml-auto text-xs font-medium text-muted">
                  {fmtDate(c.created_at)}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        {!ready ? null : userId ? (
          <form onSubmit={submit} className="rounded-3xl border border-line bg-surface p-5">
            <label htmlFor="comment-body" className="text-sm font-semibold text-ink">
              Join the discussion
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={1000}
              rows={3}
              required
              placeholder="Share your thoughts…"
              className="mt-3 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-base text-ink outline-none placeholder:text-muted focus:border-accent"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={busy || !body.trim()}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-50"
              >
                {busy ? "Posting…" : "Post comment"}
              </button>
              <span className="text-xs text-muted">
                Comments are moderated — yours appears once approved.
              </span>
            </div>
            {note && <p className="mt-3 text-sm font-medium text-emerald-700">{note}</p>}
            {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
          </form>
        ) : (
          <p className="rounded-3xl border border-line bg-surface p-5 text-sm text-ink-soft">
            <Link
              href={`/login?next=/articles/${slug}`}
              className="font-semibold text-accent-deep underline"
            >
              Sign in
            </Link>{" "}
            to join the discussion. Comments are moderated before they appear.
          </p>
        )}
      </div>
    </section>
  );
}
