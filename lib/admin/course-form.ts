import type { CourseFormData } from "@/app/admin/(panel)/courses/CourseForm";

const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

export const EMPTY_COURSE: CourseFormData = {
  name: "",
  slug: "",
  category: "",
  summary: "",
  sortOrder: 99,
  isPublished: false,
  headline: "",
  lede: "",
  intro: "",
  levels: [],
  about: [],
  whatYouStudy: [],
  whoFor: [],
  careers: [],
  careersNote: "",
  admissionsNote: "",
  feesNote: "",
  whyNote: "",
  metaTitle: "",
  metaDescription: "",
};

/** Map a `courses` row (with its `content` jsonb) to the editor's shape. */
export function rowToFormData(row: Record<string, unknown>): CourseFormData {
  const content = (row.content ?? {}) as Record<string, unknown>;

  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    slug: (row.slug as string) ?? "",
    category: (row.category as string) ?? "",
    summary: (row.summary as string) ?? "",
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    isPublished: Boolean(row.is_published),
    headline: (row.headline as string) ?? "",
    lede: (row.lede as string) ?? "",
    intro: (row.intro as string) ?? "",
    levels: strArr(row.levels),
    about: strArr(content.about),
    whatYouStudy: strArr(content.whatYouStudy),
    whoFor: strArr(content.whoFor),
    careers: strArr(content.careers),
    careersNote: typeof content.careersNote === "string" ? content.careersNote : "",
    admissionsNote: typeof content.admissionsNote === "string" ? content.admissionsNote : "",
    feesNote: typeof content.feesNote === "string" ? content.feesNote : "",
    whyNote: typeof content.whyNote === "string" ? content.whyNote : "",
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
  };
}
