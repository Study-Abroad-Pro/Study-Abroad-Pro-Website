"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/admin/Toast";
import ImageDropField from "@/components/admin/ImageDropField";
import {
  ChipList,
  ObjectList,
  StringList,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/fields";
import type { SectionKey, SectionVisibility } from "@/lib/countries-sections";
import {
  createCountry,
  updateCountry,
  deleteCountry,
  uploadCountryImage,
  type CountryActionState,
} from "./actions";

const initial: CountryActionState = { ok: false };

export type CountryFormData = {
  id?: string;
  name: string;
  slug: string;
  code: string;
  short: string;
  sortOrder: number;
  isPublished: boolean;
  flagKey: string;
  flagUrl: string;
  headline: string;
  lede: string;
  intro: string;
  blurb: string;
  intakes: string[];
  languages: string[];
  levelsSummary: string;
  studyAreas: string;
  programmes: string[];
  whyBullets: string[];
  highlights: { title: string; body: string }[];
  why: { title: string; body: string }[];
  levels: { level: string; note: string }[];
  courses: { group: string; items: string[] }[];
  admissions: string[];
  englishNote: string;
  budget: { label: string; detail: string }[];
  budgetNote: string;
  scholarships: string[];
  life: string[];
  faqs: { q: string; a: string }[];
  lat: string;
  lon: string;
  metaTitle: string;
  metaDescription: string;
  sections: SectionVisibility;
};

function Section({
  title,
  description,
  sectionKey,
  defaultVisible = true,
  children,
}: {
  title: string;
  description?: string;
  /** When set, the section header shows a "show on the site" toggle. */
  sectionKey?: SectionKey;
  defaultVisible?: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(defaultVisible);
  const hideable = Boolean(sectionKey);

  return (
    <section
      className={`flex flex-col gap-5 rounded-xl border p-5 transition-colors sm:p-6 ${
        hideable && !visible
          ? "border-dashed border-[#d7dbe0] bg-[#fbfcfd]"
          : "border-[#e6e8ec] bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-base font-bold tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[#8b93a1]">{description}</p>
          )}
        </div>

        {hideable && (
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[#e6e8ec] bg-white px-2.5 py-1.5 text-xs font-medium">
            <input
              type="checkbox"
              name={`sections[${sectionKey}]`}
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-[#d7dbe0] text-[#ff320d] focus:ring-[#171717]/20"
            />
            <span className={visible ? "text-[#047857]" : "text-[#8b93a1]"}>
              {visible ? "Shown on the site" : "Hidden"}
            </span>
          </label>
        )}
      </div>

      <div
        className={`flex flex-col gap-5 ${
          hideable && !visible ? "opacity-50" : ""
        }`}
      >
        {children}
      </div>
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
      {pending
        ? "Saving…"
        : mode === "create"
          ? "Create country"
          : "Save changes"}
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

export default function CountryForm({
  mode,
  data,
  canDelete,
}: {
  mode: "create" | "edit";
  data: CountryFormData;
  canDelete?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useActionState(
    mode === "create" ? createCountry : updateCountry,
    initial,
  );
  const [delState, delAction] = useActionState(deleteCountry, initial);
  const [confirming, setConfirming] = useState(false);

  const slugRef = useRef<HTMLInputElement>(null);
  const slugTouched = useRef(mode === "edit");

  useEffect(() => {
    if (state.ok) toast("Country saved.", "success");
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  useEffect(() => {
    if (delState.error) toast(delState.error, "error");
  }, [delState, toast]);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-5">
        {mode === "edit" && <input type="hidden" name="id" value={data.id} />}

        <Section
          title="Identity"
          description="The name, address and flag for this destination."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Country name"
              name="name"
              defaultValue={data.name}
              required
              placeholder="e.g. France"
              onValueChange={(v) => {
                if (!slugTouched.current && slugRef.current) {
                  slugRef.current.value = `study-in-${slugify(v)}`;
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
                placeholder="study-in-france"
                className="rounded-lg border border-[#d7dbe0] bg-white px-3 py-2 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
              <p className="text-xs text-[#8b93a1]">
                The page will live at <span className="font-mono">/{data.slug || "study-in-…"}</span>
              </p>
            </div>
            <TextInput
              label="Country code"
              name="code"
              defaultValue={data.code}
              required
              placeholder="fr"
              hint="Short lowercase code, e.g. ca, gb, fr"
            />
            <TextInput
              label="Short label"
              name="short"
              defaultValue={data.short}
              placeholder="FR"
              hint="Two letters, used on compact chips"
            />
            <TextInput
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={data.sortOrder}
              hint="Lower numbers appear first across the site"
            />
          </div>

          <ImageDropField
            label="Flag image"
            name="flag_path"
            defaultKey={data.flagKey}
            defaultUrl={data.flagUrl}
            uploadAction={uploadCountryImage}
            hint="Square works best. Leave empty to use the built-in flag artwork where available."
          />

          <Toggle
            label="Published"
            name="is_published"
            defaultChecked={data.isPublished}
            hint="Unpublished countries are hidden from the public site."
          />
        </Section>

        <Section
          title="Hero"
          description="The top of the country page: the headline, intro line and the three quick facts."
        >
          <TextInput label="Headline" name="headline" defaultValue={data.headline} />
          <TextArea label="Lede" name="lede" defaultValue={data.lede} rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ChipList
              label="Common intakes"
              name="intakes"
              defaultItems={data.intakes}
              placeholder="September, then Enter"
              hint="Shown as “September · January · May”"
            />
            <ChipList
              label="Languages of instruction"
              name="languages"
              defaultItems={data.languages}
              placeholder="English, then Enter"
            />
          </div>
          <TextInput
            label="Study levels available"
            name="levels_summary"
            defaultValue={data.levelsSummary}
            placeholder="Diploma to Master's"
            hint="A short summary — also used in the destinations comparison table"
          />
        </Section>

        <Section
          title="Overview"
          description="The “why this destination” intro and the summary details used on the Study Destinations page."
        >
          <TextArea label="Intro paragraph" name="intro" defaultValue={data.intro} rows={4} />
          <TextArea
            label="Short summary (blurb)"
            name="blurb"
            defaultValue={data.blurb}
            rows={2}
            hint="One or two lines summarising the destination"
          />
          <StringList
            label="“Why explore” bullets"
            name="why_bullets"
            defaultItems={data.whyBullets}
            placeholder="e.g. Post-study work rights"
            addLabel="Add bullet"
            hint="Short points shown on the Study Destinations page"
          />
          <TextInput
            label="Popular study areas"
            name="study_areas"
            defaultValue={data.studyAreas}
            placeholder="Business, IT, Nursing, Engineering, Healthcare"
            hint="Comma-separated — shown in the comparison table"
          />
          <ChipList
            label="Programmes available"
            name="programmes"
            defaultItems={data.programmes}
            placeholder="Bachelor's, then Enter"
          />
        </Section>

        <Section
          title="Highlights"
          description="“What stands out about studying here” — a title and a short paragraph each."
          sectionKey="highlights"
          defaultVisible={data.sections.highlights}
        >
          <ObjectList
            label="Highlights"
            name="highlights"
            addLabel="Add highlight"
            fields={[
              { key: "title", label: "Title", type: "text" },
              { key: "body", label: "Description", type: "textarea", rows: 2 },
            ]}
            defaultItems={data.highlights}
          />
        </Section>

        <Section
          title="Why study here"
          description="The case for this destination, point by point."
          sectionKey="why"
          defaultVisible={data.sections.why}
        >
          <ObjectList
            label="Reasons"
            name="why"
            addLabel="Add reason"
            fields={[
              { key: "title", label: "Heading", type: "text" },
              { key: "body", label: "Detail", type: "textarea", rows: 2 },
            ]}
            defaultItems={data.why}
          />
        </Section>

        <Section
          title="Study levels"
          description="Each entry route and what it means."
          sectionKey="levels"
          defaultVisible={data.sections.levels}
        >
          <ObjectList
            label="Levels"
            name="levels"
            addLabel="Add level"
            fields={[
              { key: "level", label: "Level", type: "text", placeholder: "Bachelor's Degree" },
              { key: "note", label: "Note", type: "textarea", rows: 2 },
            ]}
            defaultItems={data.levels}
          />
        </Section>

        <Section
          title="Popular courses"
          description="Grouped by field. Add course names as chips."
          sectionKey="courses"
          defaultVisible={data.sections.courses}
        >
          <ObjectList
            label="Course groups"
            name="courses"
            addLabel="Add group"
            fields={[
              { key: "group", label: "Group name", type: "text", placeholder: "Business & management" },
              { key: "items", label: "Courses", type: "chips", placeholder: "MBA, then Enter" },
            ]}
            defaultItems={data.courses}
          />
        </Section>

        <Section
          title="Admission requirements"
          description="What applicants usually need — one requirement per line."
          sectionKey="admissions"
          defaultVisible={data.sections.admissions}
        >
          <StringList
            label="Requirements"
            name="admissions"
            textarea
            defaultItems={data.admissions}
            addLabel="Add requirement"
          />
        </Section>

        <Section
          title="English requirements"
          sectionKey="english"
          defaultVisible={data.sections.english}
        >
          <TextArea
            label="Country-specific note"
            name="english_note"
            defaultValue={data.englishNote}
            rows={3}
            hint="Shown after the shared English-requirements framework"
          />
        </Section>

        <Section
          title="Tuition & budget"
          description="What drives the cost — a label and an explanation each."
          sectionKey="budget"
          defaultVisible={data.sections.budget}
        >
          <ObjectList
            label="Cost drivers"
            name="budget"
            addLabel="Add cost driver"
            fields={[
              { key: "label", label: "Label", type: "text", placeholder: "Tuition" },
              { key: "detail", label: "Detail", type: "textarea", rows: 2 },
            ]}
            defaultItems={data.budget}
          />
          <TextArea
            label="“Why no single number” note"
            name="budget_note"
            defaultValue={data.budgetNote}
            rows={2}
          />
        </Section>

        <Section
          title="Scholarships"
          description="The categories of funding worth chasing — one per line."
          sectionKey="scholarships"
          defaultVisible={data.sections.scholarships}
        >
          <StringList
            label="Scholarship notes"
            name="scholarships"
            textarea
            defaultItems={data.scholarships}
            addLabel="Add note"
          />
        </Section>

        <Section
          title="Student life"
          description="What day-to-day life tends to look like — one point per line."
          sectionKey="life"
          defaultVisible={data.sections.life}
        >
          <StringList
            label="Student life points"
            name="life"
            textarea
            defaultItems={data.life}
            addLabel="Add point"
          />
        </Section>

        <Section
          title="FAQs"
          description="Questions and answers for the country page."
          sectionKey="faqs"
          defaultVisible={data.sections.faqs}
        >
          <ObjectList
            label="Questions"
            name="faqs"
            addLabel="Add question"
            fields={[
              { key: "q", label: "Question", type: "text" },
              { key: "a", label: "Answer", type: "textarea", rows: 3 },
            ]}
            defaultItems={data.faqs}
          />
        </Section>

        <Section
          title="Map & SEO"
          description="Globe marker position and search-engine metadata."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Latitude"
              name="lat"
              defaultValue={data.lat}
              required
              hint="Between -90 and 90"
            />
            <TextInput
              label="Longitude"
              name="lon"
              defaultValue={data.lon}
              required
              hint="Between -180 and 180"
            />
          </div>
          <TextInput
            label="Meta title"
            name="meta_title"
            defaultValue={data.metaTitle}
            hint="Leave blank to auto-generate from the country name"
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
            onClick={() => router.push("/admin/countries")}
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
              Delete this country
            </button>
          ) : (
            <form action={delAction} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={data.id} />
              <p className="text-xs text-[#5b6270]">
                Permanently removes the country and its content. This is logged.
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
