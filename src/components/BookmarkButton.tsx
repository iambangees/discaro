"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase-browser";

/**
 * Save/unsave toggle for one article or opportunity. Signed-out visitors
 * get a sign-in link instead. State is read from (and written to) the
 * bookmarks table under the owner's RLS policies.
 */
export default function BookmarkButton({
  postId,
  opportunityId,
}: {
  postId?: string;
  opportunityId?: string;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<"loading" | "out" | "unsaved" | "saved">("loading");
  const [busy, setBusy] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const sbReady = getBrowserSupabase() !== null;

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
        setState("out");
        return;
      }
      setUserId(user.id);
      let query = sb.from("bookmarks").select("id").eq("user_id", user.id);
      query = postId ? query.eq("post_id", postId) : query.eq("opportunity_id", opportunityId!);
      const { data } = await query.maybeSingle();
      if (!cancelled) setState(data ? "saved" : "unsaved");
    })();
    return () => {
      cancelled = true;
    };
  }, [postId, opportunityId]);

  async function toggle() {
    const sb = getBrowserSupabase();
    if (!sb || !userId || busy) return;
    setBusy(true);
    const wasSaved = state === "saved";
    setState(wasSaved ? "unsaved" : "saved");
    let error = null;
    if (wasSaved) {
      let query = sb.from("bookmarks").delete().eq("user_id", userId);
      query = postId ? query.eq("post_id", postId) : query.eq("opportunity_id", opportunityId!);
      ({ error } = await query);
    } else {
      ({ error } = await sb.from("bookmarks").insert({
        user_id: userId,
        post_id: postId ?? null,
        opportunity_id: opportunityId ?? null,
      }));
    }
    if (error) setState(wasSaved ? "saved" : "unsaved");
    setBusy(false);
  }

  const base =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors";

  if (!sbReady) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname ?? "/")}`}
        aria-label="Sign in to save this"
        title="Sign in to save this"
        className={`${base} border-line text-muted hover:border-accent hover:text-accent-deep`}
      >
        <Bookmark className="h-4.5 w-4.5" aria-hidden />
      </Link>
    );
  }

  if (state === "out") {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname ?? "/")}`}
        aria-label="Sign in to save this"
        title="Sign in to save this"
        className={`${base} border-line text-muted hover:border-accent hover:text-accent-deep`}
      >
        <Bookmark className="h-4.5 w-4.5" aria-hidden />
      </Link>
    );
  }
  if (state === "loading") {
    return (
      <span className={`${base} border-line text-muted opacity-50`} aria-hidden>
        <Bookmark className="h-4.5 w-4.5" />
      </span>
    );
  }
  const saved = state === "saved";
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      title={saved ? "Saved — tap to remove" : "Save for later"}
      className={`${base} ${
        saved
          ? "border-accent bg-accent text-white hover:bg-accent-deep"
          : "border-line text-muted hover:border-accent hover:text-accent-deep"
      }`}
    >
      <Bookmark className={`h-4.5 w-4.5 ${saved ? "fill-current" : ""}`} aria-hidden />
    </button>
  );
}
