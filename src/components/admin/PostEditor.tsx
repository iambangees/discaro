"use client";

import { useActionState, useState } from "react";
import { savePost, type ActionState } from "@/app/admin/actions";
import type { AdminPost } from "@/lib/admin";
import type { Category } from "@/lib/site";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import RichTextEditor from "./RichTextEditor";

const initialState: ActionState = {};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

export default function PostEditor({
  post,
  categories,
}: {
  post: AdminPost | null;
  categories: Category[];
}) {
  const [state, formAction, pending] = useActionState(savePost, initialState);
  const [body, setBody] = useState(post?.body ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  function slugifyClient(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90);
  }

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyClient(value));
  }
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");
  const [uploadMsg, setUploadMsg] = useState("");

  async function uploadCover(file: File) {
    const sb = getBrowserSupabase();
    if (!sb) {
      setUploadMsg("Upload unavailable — Supabase is not configured.");
      return;
    }
    setUploadMsg("Uploading…");
    const path = `covers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error } = await sb.storage.from("media").upload(path, file, { upsert: false });
    if (error) {
      setUploadMsg(`Upload failed: ${error.message}`);
      return;
    }
    const { data } = sb.storage.from("media").getPublicUrl(path);
    setCoverUrl(data.publicUrl);
    setUploadMsg("Uploaded — the cover URL is filled in.");
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <div>
        <label htmlFor="pe-title" className={labelCls}>Title</label>
        <input id="pe-title" name="title" required value={title} onChange={(e) => onTitleChange(e.target.value)} className={inputCls} placeholder="The headline readers will see" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="pe-slug" className={labelCls}>Slug (URL)</label>
          <input id="pe-slug" name="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className={inputCls} placeholder="fills in from the title" />
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            This is the article's web address — it fills itself in from the title. You never need
            to type or paste a link here; links belong in the article text below.
          </p>
        </div>
        <div>
          <label htmlFor="pe-category" className={labelCls}>Category</label>
          <select id="pe-category" name="category_id" defaultValue={post?.category_id ?? ""} className={inputCls}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.dbId ?? ""} disabled={!c.dbId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="pe-excerpt" className={labelCls}>Excerpt</label>
        <textarea id="pe-excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={inputCls} placeholder="One or two sentences shown on cards and in search results" />
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          Just the short summary shown on listing pages — the full article goes in the big box below.
        </p>
      </div>
      <div>
        <span className={labelCls} id="pe-body-label">Article text — the full article, links and pictures go here</span>
        <div aria-labelledby="pe-body-label">
          <RichTextEditor value={body} onChange={setBody} />
        </div>
        <input type="hidden" name="body" value={body} />
      </div>
      <div>
        <label htmlFor="pe-cover" className={labelCls}>Cover image URL</label>
        <input id="pe-cover" name="cover_image_url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className={inputCls} placeholder="https://…" />
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="Cover preview" className="mt-3 aspect-[16/9] w-full max-w-sm rounded-xl object-cover" />
        )}
        <div className="mt-2 flex items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:border-accent/50 hover:text-accent-deep">
            Upload an image
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadCover(f);
              }}
            />
          </label>
          {uploadMsg && <span className="text-sm text-muted" role="status">{uploadMsg}</span>}
        </div>
      </div>
      <div>
        <label htmlFor="pe-tags" className={labelCls}>Tags (comma-separated)</label>
        <input id="pe-tags" name="tags" defaultValue={(post?.tags ?? []).join(", ")} className={inputCls} placeholder="e.g. grants, students, africa" />
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          Labels for this article, separated by commas. They help readers find related pieces.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="pe-status" className={labelCls}>Status</label>
          <select id="pe-status" name="status" defaultValue={post?.status ?? "draft"} className={inputCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div>
          <label htmlFor="pe-published" className={labelCls}>Publish date/time</label>
          <input id="pe-published" name="published_at" type="datetime-local" defaultValue={toLocalInput(post?.published_at ?? null)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="pe-trending" className={labelCls}>Trending score</label>
          <input id="pe-trending" name="trending_score" type="number" min={0} defaultValue={post?.trending_score ?? 0} className={inputCls} />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} className="h-4 w-4 accent-[#0b6bff]" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="affiliate" defaultChecked={post?.affiliate ?? false} className="h-4 w-4 accent-[#0b6bff]" />
          Contains affiliate links (shows the disclosure)
        </label>
      </div>
      {state.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep disabled:opacity-60">
          {pending ? "Saving…" : post ? "Save changes" : "Create article"}
        </button>
        <p className="text-sm text-muted">Scheduled articles go public automatically at their date/time.</p>
      </div>
    </form>
  );
}
