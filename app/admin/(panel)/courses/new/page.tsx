import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { EMPTY_COURSE } from "@/lib/admin/course-form";
import CourseForm from "../CourseForm";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  await requireAdmin();

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
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        Add a course
      </h1>
      <p className="-mt-3 max-w-2xl text-sm text-[#5b6270]">
        Fill in as much as you can now — keep it unpublished and finish later, or
        duplicate an existing course to start from a full template.
      </p>
      <CourseForm mode="create" data={EMPTY_COURSE} />
    </div>
  );
}
