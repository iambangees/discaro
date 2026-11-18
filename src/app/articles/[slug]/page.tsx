import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { formatDate, getPostBySlug, getRelatedPosts } from "@/lib/data";
import PostCard from "@/components/PostCard";

// Database-driven route: rendered per request, never prerendered.
export const instant = false;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      {post.category && (
        <Link
          href={`/${post.category.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> {post.category.name}
        </Link>
      )}
      <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
      )}
      <p className="mt-4 text-sm font-medium text-muted">
        Published {formatDate(post.published_at)}
        {post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10)
          ? ` · Updated ${formatDate(post.updated_at)}`
          : ""}
      </p>

      {post.affiliate && (
        <p className="mt-6 flex gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden />
          <span>
            <strong>Disclosure:</strong> this article contains affiliate links. If you buy through
            them, Discaro may earn a commission at no extra cost to you. See our{" "}
            <Link href="/affiliate-disclosure" className="font-semibold underline">
              affiliate disclosure
            </Link>
            .
          </span>
        </p>
      )}

      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt=""
          className="mt-8 w-full rounded-3xl border border-line object-cover"
        />
      )}

      {/*
        Body is rich-text HTML authored in the admin editor (Phase 4 adds
        sanitisation there). Until the editor exists, content is written
        by the site owner directly in the database.
      */}
      <div
        className="article-body mt-8"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold tracking-tight text-ink">
            Related reading
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
