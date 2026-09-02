import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui/Button";
import Markdown from "@/components/blog/Markdown";
import PostCard from "@/components/blog/PostCard";
import FinalCta from "@/components/sections/FinalCta";
import { formatPostDate } from "@/content/blog";
import { getPost, getPublishedPosts, getPublishedPostSlugs } from "@/lib/data/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: post.coverUrl ? [{ url: post.coverUrl }] : undefined,
    },
  };
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const more = (await getPublishedPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Study Abroad Pro" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ---- article ---- */}
      <article className="relative z-20 bg-white pb-24 pt-32 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-paper"
        />
        <div className="relative mx-auto w-full max-w-[44rem] px-6 sm:px-8">
          <nav aria-label="Breadcrumb" className="label text-ink/40">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href="/blog" className="hover:text-brand">
              Blog
            </Link>
          </nav>

          <p className="label mt-10 text-brand">{post.category}</p>
          <h1 className="mt-4 text-[clamp(2rem,4.6vw,3.1rem)] font-extrabold leading-[1.03]">
            {post.title}
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <span>{formatPostDate(post.date)}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readMinutes} min read</span>
          </p>

          {post.coverUrl && (
            <div className="mt-10 overflow-hidden rounded-2xl ring-1 ring-ink/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverUrl}
                alt=""
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-12">
            <Markdown>{post.body}</Markdown>
          </div>

          <div className="mt-14 rounded-2xl bg-cream p-7 ring-1 ring-ink/8 sm:p-8">
            <p className="label text-brand">Next step</p>
            <p className="mt-3 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-soft">
              A free counselling session turns a guide like this into a shortlist
              built around your profile.
            </p>
            <Link
              href="/#counselling"
              className="group mt-5 inline-flex items-center gap-2 font-display text-[0.9375rem] font-semibold text-brand underline-offset-4 hover:underline"
            >
              Book free counselling
              <Arrow />
            </Link>
          </div>
        </div>
      </article>

      {/* ---- more posts ---- */}
      <section className="relative z-20 bg-paper py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand">More from the blog</p>
          <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.slug} post={p} headingLevel="h3" />
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
