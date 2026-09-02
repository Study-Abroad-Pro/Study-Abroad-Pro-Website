import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase, storageUrl } from "@/lib/supabase/service";
import PostForm, { type PostFormData } from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;

  const { data: p } = await getServiceSupabase()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!p) notFound();

  const data: PostFormData = {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    category: p.category ?? "",
    author: p.author,
    coverKey: p.cover_path ?? "",
    coverUrl: p.cover_path ? storageUrl("media", p.cover_path) : "",
    body_md: p.body_md,
    is_published: p.is_published,
    published_at: p.published_at ? p.published_at.slice(0, 10) : "",
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Blog
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {p.title}
        </h1>
        <a
          href={`/blog/${p.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
        >
          View public page ↗
        </a>
      </div>

      <PostForm
        mode="edit"
        data={data}
        canDelete={session.role === "superadmin"}
      />
    </div>
  );
}
