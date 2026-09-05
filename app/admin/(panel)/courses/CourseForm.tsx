"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/admin/Toast";
import { ChipList, StringList, TextArea, TextInput, Toggle } from "@/components/admin/fields";
import { COURSE_CATEGORIES } from "@/content/courses";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  type CourseActionState,
} from "./actions";

const initial: CourseActionState = { ok: false };

export type CourseFormData = {
  id?: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  sortOrder: number;
  isPublished: boolean;
  headline: string;
  lede: string;
  intro: string;
  levels: string[];
  about: string[];
  whatYouStudy: string[];
  whoFor: string[];
  careers: string[];
  careersNote: string;
  admissionsNote: string;
  feesNote: string;
  whyNote: string;
  metaTitle: string;
  metaDescription: string;
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-[#e6e8ec] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-base font-bold tracking-tight">{title}</h2>
        {description && <p className="text-xs text-[#8b93a1]">{description}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function SubmitBar({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#ff320d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d92306] disabled:opacity-60"
    >
      {pending ? "Saving…" : mode === "create" ? "Create course" : "Save changes"}
    </button>
  );
}

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CourseForm({
  mode,
  data,
  canDelete,
}: {
  mode: "create" | "edit";
  data: CourseFormData;
  canDelete?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useActionState(
    mode === "create" ? createCourse : updateCourse,
    initial,
  );
  const [delState, delAction] = useActionState(deleteCourse, initial);
  const [confirming, setConfirming] = useState(false);

  const slugRef = useRef<HTMLInputElement>(null);
  const slugTouched = useRef(mode === "edit");

  useEffect(() => {
    if (state.ok) toast("Course saved.", "success");
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  useEffect(() => {
    if (delState.error) toast(delState.error, "error");
  }, [delState, toast]);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-5">
        {mode === "edit" && <input type="hidden" name="id" value={data.id} />}

        <Section title="Identity" description="The name, category and listing summary for this course.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Course name"
              name="name"
              defaultValue={data.name}
              required
              placeholder="e.g. Nursing"
              onValueChange={(v) => {
                if (!slugTouched.current && slugRef.current) {
                  slugRef.current.value = slugify(v);
                }
              }}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3a3532]">
                URL slug <span className="text-[#b42318]">*</span>
              </label>
              <input
                ref={slugRef}
                name="slug"
                defaultValue={data.slug}
                required
                onChange={() => (slugTouched.current = true)}
                placeholder="nursing"
                className="rounded-lg border border-[#d7dbe0] bg-white px-3 py-2 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
              <p className="text-xs text-[#8b93a1]">
                The page will live at <span className="font-mono">/courses/{data.slug || "…"}</span>
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3a3532]">
                Category <span className="text-[#b42318]">*</span>
              </label>
              <select
                name="category"
                defaultValue={data.category}
                required
                className="rounded-lg border border-[#d7dbe0] bg-white px-3 py-2 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              >
                <option value="" disabled>
                  Select a category…
                </option>
                {COURSE_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#8b93a1]">Groups this course on the /courses page.</p>
            </div>

            <TextInput
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={data.sortOrder}
              hint="Lower numbers appear first within their category"
            />
          </div>

          <TextArea
            label="Listing summary"
            name="summary"
            defaultValue={data.summary}
            rows={2}
            hint="Shown on the /courses page under the course name"
          />

          <Toggle
            label="Published"
            name="is_published"
            defaultChecked={data.isPublished}
            hint="Unpublished courses are hidden from the public site."
          />
        </Section>

        <Section title="Hero" description="The top of the course page.">
          <TextInput
            label="Headline"
            name="headline"
            defaultValue={data.headline}
            placeholder="Study Nursing Abroad"
          />
          <TextArea label="Lede" name="lede" defaultValue={data.lede} rows={2} />
          <TextArea
            label="Intro paragraph"
            name="intro"
            defaultValue={data.intro}
            rows={3}
            hint="Shown under the lede, above the buttons"
          />
        </Section>

        <Section title="About" description="A short explanation of what this field is.">
          <StringList
            label="Paragraphs"
            name="about"
            textarea
            defaultItems={data.about}
            addLabel="Add paragraph"
          />
        </Section>

        <Section title="What you may study" description="Shown as chips on the course page.">
          <ChipList
            label="Topics"
            name="what_you_study"
            defaultItems={data.whatYouStudy}
            placeholder="e.g. Anatomy & Physiology, then Enter"
          />
        </Section>

        <Section title="Study levels" description="Shown as a chip chain, e.g. Diploma | Bachelor's | Master's.">
          <ChipList
            label="Levels"
            name="levels"
            defaultItems={data.levels}
            placeholder="e.g. Bachelor's, then Enter"
          />
        </Section>

        <Section title="Who is this course for?">
          <StringList label="Points" name="who_for" defaultItems={data.whoFor} addLabel="Add point" />
        </Section>

        <Section title="Career areas">
          <ChipList
            label="Career areas"
            name="careers"
            defaultItems={data.careers}
            placeholder="e.g. Nursing, then Enter"
          />
          <TextArea
            label="Career note"
            name="careers_note"
            defaultValue={data.careersNote}
            rows={2}
            hint="e.g. registration/licensing caveats"
          />
        </Section>

        <Section
          title="Admissions, fees & why abroad"
          description="Layered on top of the shared framework shown on every course page."
        >
          <TextArea
            label="Admissions note"
            name="admissions_note"
            defaultValue={data.admissionsNote}
            rows={2}
            hint="Course-specific admissions detail, shown after the shared requirements"
          />
          <TextArea
            label="Fees note"
            name="fees_note"
            defaultValue={data.feesNote}
            rows={2}
            hint="Course-specific cost detail, shown after the shared fees text"
          />
          <TextArea
            label="“Why study abroad” note"
            name="why_note"
            defaultValue={data.whyNote}
            rows={3}
            hint="Leave blank to use the default generic paragraph"
          />
        </Section>

        <Section title="SEO">
          <TextInput
            label="Meta title"
            name="meta_title"
            defaultValue={data.metaTitle}
            hint="Leave blank to auto-generate from the headline"
          />
          <TextArea
            label="Meta description"
            name="meta_description"
            defaultValue={data.metaDescription}
            rows={2}
          />
        </Section>

        <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-3 border-t border-[#e6e8ec] bg-[#f6f7f9]/90 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <SubmitBar mode={mode} />
          <button
            type="button"
            onClick={() => router.push("/admin/courses")}
            className="text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
          >
            Back to list
          </button>
        </div>
      </form>

      {mode === "edit" && canDelete && (
        <div className="rounded-xl border border-[#f0d9d5] bg-[#fdf6f5] p-5">
          <h2 className="text-sm font-semibold text-[#b42318]">Danger zone</h2>
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-2 text-xs font-medium text-[#b42318] hover:underline"
            >
              Delete this course
            </button>
          ) : (
            <form action={delAction} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={data.id} />
              <p className="text-xs text-[#5b6270]">
                Permanently removes the course and its content. This is logged.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#b42318] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#951d13]"
                >
                  Delete permanently
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-[#d7dbe0] px-3 py-1.5 text-xs font-medium text-[#16181d]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
