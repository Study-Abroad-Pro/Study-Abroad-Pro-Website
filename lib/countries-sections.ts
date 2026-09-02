/**
 * Which country-page sections an admin can hide per country.
 *
 * Stored in `countries.content.sections` as `{ [key]: boolean }`. A missing key
 * means "visible" — so existing countries and new ones default to everything on.
 * Shared by the admin editor and the public page so the keys can't drift.
 */

export const TOGGLEABLE_SECTIONS = [
  "highlights",
  "why",
  "levels",
  "courses",
  "admissions",
  "english",
  "budget",
  "scholarships",
  "life",
  "faqs",
] as const;

export type SectionKey = (typeof TOGGLEABLE_SECTIONS)[number];
export type SectionVisibility = Record<SectionKey, boolean>;

/** Human labels for the editor toggles. */
export const SECTION_LABELS: Record<SectionKey, string> = {
  highlights: "Highlights",
  why: "Why study here",
  levels: "Study levels",
  courses: "Popular courses",
  admissions: "Admission requirements",
  english: "English requirements",
  budget: "Tuition & budget",
  scholarships: "Scholarships",
  life: "Student life",
  faqs: "FAQs",
};

export function normalizeSections(raw: unknown): SectionVisibility {
  const src =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out = {} as SectionVisibility;
  for (const key of TOGGLEABLE_SECTIONS) {
    out[key] = src[key] === undefined ? true : src[key] !== false;
  }
  return out;
}
