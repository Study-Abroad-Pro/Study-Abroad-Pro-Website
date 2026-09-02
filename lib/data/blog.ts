import { unstable_cache } from "next/cache";
import { getPublicSupabase, storageUrl } from "@/lib/supabase/public";
import { readingMinutes } from "@/content/blog";

/**
 * Read model for the blog. Backed by the `blog_posts` table, edited in
 * `/admin/blog`. Cached with the `blog` tag; admin actions revalidate it.
 */

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  coverUrl: string | null;
};

export type FullPost = PostSummary & { body: string };

type Row = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  author: string;
  body_md: string;
  cover_path: string | null;
  published_at: string | null;
  created_at: string;
};

function toSummary(r: Row): PostSummary {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    category: r.category ?? "Guide",
    author: r.author,
    date: r.published_at ?? r.created_at,
    readMinutes: readingMinutes(r.body_md),
    coverUrl: r.cover_path ? storageUrl("media", r.cover_path) : null,
  };
}

const COLS =
  "slug, title, excerpt, category, author, body_md, cover_path, published_at, created_at";

export const getPublishedPosts = unstable_cache(
  async (): Promise<PostSummary[]> => {
    const { data } = await getPublicSupabase()
      .from("blog_posts")
      .select(COLS)
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    return (data ?? []).map((r) => toSummary(r as Row));
  },
  ["published-posts"],
  { tags: ["blog"] },
);

export const getPublishedPostSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await getPublicSupabase()
      .from("blog_posts")
      .select("slug")
      .eq("is_published", true);
    return (data ?? []).map((r) => r.slug);
  },
  ["published-post-slugs"],
  { tags: ["blog"] },
);

export const getPost = unstable_cache(
  async (slug: string): Promise<FullPost | null> => {
    const { data } = await getPublicSupabase()
      .from("blog_posts")
      .select(COLS)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!data) return null;
    const r = data as Row;
    return { ...toSummary(r), body: r.body_md };
  },
  ["blog-post"],
  { tags: ["blog"] },
);
