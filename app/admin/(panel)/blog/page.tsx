import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { PublishBadge } from "@/components/admin/StatusBadge";
import { setPostPublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  await requireAdmin();

  const { data: posts } = await getServiceSupabase()
    .from("blog_posts")
    .select("id, title, slug, category, is_published, published_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("updated_at", { ascending: false });

  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Blog
          </h1>
          <p className="text-sm text-[#5b6270]">
            {posts?.length ?? 0} post{(posts?.length ?? 0) === 1 ? "" : "s"}.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-[#ff320d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d92306]"
        >
          New post
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-[#e6e8ec] bg-white">
        {!posts || posts.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[#8b93a1]">
            No posts yet.
          </p>
        ) : (
          <table className="w-full min-w-[42rem] text-sm">
            <thead>
              <tr className="border-b border-[#e6e8ec] text-left text-xs uppercase tracking-wide text-[#8b93a1]">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef0f3]">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-[#f9fafb]">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="font-medium text-[#16181d] hover:text-[#ff320d]"
                    >
                      {p.title}
                    </Link>
                    <span className="ml-2 font-mono text-xs text-[#8b93a1]">
                      /{p.slug}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#5b6270]">
                    {p.category ?? "—"}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-xs text-[#8b93a1]">
                    {p.published_at
                      ? dateFmt.format(new Date(p.published_at))
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <PublishBadge published={p.is_published} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <form action={setPostPublished}>
                        <input type="hidden" name="id" value={p.id} />
                        <input
                          type="hidden"
                          name="publish"
                          value={p.is_published ? "0" : "1"}
                        />
                        <button
                          type="submit"
                          className="text-xs font-medium text-[#5b6270] hover:text-[#16181d]"
                        >
                          {p.is_published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="text-xs font-semibold text-[#ff320d] hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
