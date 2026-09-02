import type { Metadata } from "next";
import Link from "next/link";
import FinalCta from "@/components/sections/FinalCta";
import ScrollReveals from "@/components/motion/ScrollReveals";
import PostCard from "@/components/blog/PostCard";
import { getPublishedPosts } from "@/lib/data/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides on choosing a study destination, English test requirements, budgeting and the application process — written in plain terms, without the sales pitch.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Study Abroad Pro — Blog",
    description: "Guides for getting the study-abroad decision right.",
  },
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Study Abroad Pro Blog",
    url: `${siteUrl}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      url: `${siteUrl}/blog/${p.slug}`,
      author: { "@type": "Organization", name: p.author },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />

      {/* ---- header ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-14 pt-32 sm:pb-16 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_60%_at_88%_-10%,rgba(255,50,13,0.09),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <nav aria-label="Breadcrumb" className="label text-ink/40">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-ink/60">Blog</span>
          </nav>

          <p className="label mt-10 text-brand">Blog</p>
          <h1 className="mt-4 max-w-[18ch] text-[clamp(2.3rem,5.4vw,4.2rem)] font-extrabold leading-[0.98]">
            Getting the decision right.
          </h1>
          <p className="mt-7 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
            Guides on choosing a destination, English tests, budgeting and the
            application process — in plain terms, and without the sales pitch.
          </p>
        </div>
      </section>

      {/* ---- posts ---- */}
      <section className="relative z-20 bg-white py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          {posts.length === 0 ? (
            <p className="text-[1.0625rem] leading-relaxed text-muted">
              No posts published yet — check back soon.
            </p>
          ) : (
            <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCta />

      <ScrollReveals />
    </>
  );
}
