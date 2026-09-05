import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { rowToFormData } from "@/lib/admin/course-form";
import CourseForm from "../CourseForm";
import { duplicateCourse } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;

  const { data: row } = await getServiceSupabase()
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();

  const data = rowToFormData(row as Record<string, unknown>);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Courses
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {row.name}
        </h1>
        <div className="flex items-center gap-2">
          <a
            href={`/courses/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#d7dbe0] px-3 py-1.5 text-sm font-medium text-[#5b6270] hover:bg-[#f3f4f6] hover:text-[#16181d]"
          >
            View public page ↗
          </a>
          <form action={duplicateCourse}>
            <input type="hidden" name="id" value={row.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7dbe0] px-3 py-1.5 text-sm font-semibold text-[#16181d] hover:bg-[#f3f4f6]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              Duplicate
            </button>
          </form>
        </div>
      </div>
      <p className="-mt-3 text-xs text-[#8b93a1]">
        "Duplicate" makes an unpublished copy of this course with every field
        pre-filled — a fast way to add a similar one.
      </p>

      <CourseForm
        mode="edit"
        data={data}
        canDelete={session.role === "superadmin"}
      />
    </div>
  );
}
