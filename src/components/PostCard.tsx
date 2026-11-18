import Link from "next/link";
import { formatDate, type PostSummary } from "@/lib/data";

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-accent/50">
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt=""
          className="mb-4 aspect-[16/9] w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {post.category && (
          <Link
            href={`/${post.category.slug}`}
            className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-deep hover:underline"
          >
            {post.category.name}
          </Link>
        )}
        {post.affiliate && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
            Contains affiliate links
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">
        <Link href={`/articles/${post.slug}`} className="hover:text-accent-deep">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      )}
      <p className="mt-4 text-xs font-medium text-muted">{formatDate(post.published_at)}</p>
    </article>
  );
}
