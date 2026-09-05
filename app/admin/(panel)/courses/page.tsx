import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { PublishBadge } from "@/components/admin/StatusBadge";
import { setCoursePublished, duplicateCourse } from "./actions";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  await requireAdmin();

  const db = getServiceSupabase();
  const { data: courses } = await db
    .from("courses")
    .select("id, name, slug, category, sort_order, is_published, updated_at")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Courses
          </h1>
          <p className="text-sm text-[#5b6270]">
            {courses?.length ?? 0} course{(courses?.length ?? 0) === 1 ? "" : "s"}.
            Lower sort order shows first within its category.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-[#ff320d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d92306]"
        >
          Add course
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-[#e6e8ec] bg-white">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="border-b border-[#e6e8ec] text-left text-xs uppercase tracking-wide text-[#8b93a1]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef0f3]">
            {(courses ?? []).map((c) => (
              <tr key={c.id} className="hover:bg-[#f9fafb]">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/courses/${c.id}`}
                    className="font-medium text-[#16181d] hover:text-[#ff320d]"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-[#5b6270]">{c.category}</td>
                <td className="px-5 py-3 font-mono text-xs text-[#5b6270]">
                  /courses/{c.slug}
                </td>
                <td className="px-5 py-3 tabular-nums text-[#5b6270]">
                  {c.sort_order}
                </td>
                <td className="px-5 py-3">
                  <PublishBadge published={c.is_published ?? false} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <form action={setCoursePublished}>
                      <input type="hidden" name="id" value={c.id} />
                      <input
                        type="hidden"
                        name="publish"
                        value={c.is_published ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        className="text-xs font-medium text-[#5b6270] hover:text-[#16181d]"
                      >
                        {c.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={duplicateCourse}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-[#5b6270] hover:text-[#16181d]"
                      >
                        Duplicate
                      </button>
                    </form>
                    <Link
                      href={`/admin/courses/${c.id}`}
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
      </div>
    </div>
  );
}
