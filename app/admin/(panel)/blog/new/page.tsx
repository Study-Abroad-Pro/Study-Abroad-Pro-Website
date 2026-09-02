import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import PostForm, { type PostFormData } from "../PostForm";

export const dynamic = "force-dynamic";

const empty: PostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  category: "Guide",
  author: "Study Abroad Pro",
  coverKey: "",
  coverUrl: "",
  body_md: "",
  is_published: false,
  published_at: "",
};

export default async function NewPostPage() {
  await requireAdmin();

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
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        New post
      </h1>
      <PostForm mode="create" data={empty} />
    </div>
  );
}
