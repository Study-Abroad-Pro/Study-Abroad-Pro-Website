import Link from "next/link";
import { formatPostDate } from "@/content/blog";
import type { PostSummary } from "@/lib/data/blog";

/**
 * One blog post in a grid — used on the blog index and in "More from the blog".
 * Cover image is optional; a branded 16:9 placeholder keeps every card the same
 * height so the grid stays even.
 */
export default function PostCard({
  post,
  headingLevel = "h2",
}: {
  post: PostSummary;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col border-t border-line pt-6"
      data-reveal
    >
      <div className="mb-5 overflow-hidden rounded-xl ring-1 ring-ink/8">
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt=""
            className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid aspect-[16/9] w-full place-items-center bg-cream">
            <span className="font-display text-base font-extrabold uppercase tracking-[0.12em] text-brand/30">
              {post.category}
            </span>
          </div>
        )}
      </div>

      <p className="label text-brand">{post.category}</p>
      <Heading className="mt-2.5 text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-brand sm:text-xl">
        {post.title}
      </Heading>
      <p className="mt-2.5 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">
        {post.excerpt}
      </p>
      <p className="mt-4 flex items-center gap-2.5 text-[0.8125rem] text-muted">
        <span>{formatPostDate(post.date)}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readMinutes} min read</span>
      </p>
    </Link>
  );
}
