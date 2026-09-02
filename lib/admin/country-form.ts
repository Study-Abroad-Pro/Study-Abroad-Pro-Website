import { storageUrl } from "@/lib/supabase/service";
import { normalizeSections } from "@/lib/countries-sections";
import type { CountryFormData } from "@/app/admin/(panel)/countries/CountryForm";

const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

const objArr = <K extends string>(v: unknown, keys: K[]): Record<K, string>[] =>
  Array.isArray(v)
    ? v.map((row) => {
        const r = (row ?? {}) as Record<string, unknown>;
        const out = {} as Record<K, string>;
        for (const k of keys) out[k] = typeof r[k] === "string" ? (r[k] as string) : "";
        return out;
      })
    : [];

export const EMPTY_COUNTRY: CountryFormData = {
  name: "",
  slug: "",
  code: "",
  short: "",
  sortOrder: 99,
  isPublished: false,
  flagKey: "",
  flagUrl: "",
  headline: "",
  lede: "",
  intro: "",
  blurb: "",
  intakes: [],
  languages: [],
  levelsSummary: "",
  studyAreas: "",
  programmes: [],
  whyBullets: [],
  highlights: [],
  why: [],
  levels: [],
  courses: [],
  admissions: [],
  englishNote: "",
  budget: [],
  budgetNote: "",
  scholarships: [],
  life: [],
  faqs: [],
  lat: "",
  lon: "",
  metaTitle: "",
  metaDescription: "",
  sections: normalizeSections({}),
};

/** Map a `countries` row (with its `content` jsonb) to the editor's shape. */
export function rowToFormData(row: Record<string, unknown>): CountryFormData {
  const content = (row.content ?? {}) as Record<string, unknown>;
  const flagKey = (row.flag_path as string) ?? "";

  const courses = Array.isArray(content.courses)
    ? (content.courses as unknown[]).map((c) => {
        const r = (c ?? {}) as Record<string, unknown>;
        return {
          group: typeof r.group === "string" ? r.group : "",
          items: strArr(r.items),
        };
      })
    : [];

  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    slug: (row.slug as string) ?? "",
    code: (row.code as string) ?? "",
    short: (row.short as string) ?? "",
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    isPublished: Boolean(row.is_published),
    flagKey,
    flagUrl: flagKey ? storageUrl("media", flagKey) : "",
    headline: (row.headline as string) ?? "",
    lede: (row.lede as string) ?? "",
    intro: (row.intro as string) ?? "",
    blurb: (row.blurb as string) ?? "",
    intakes: strArr(content.intakes),
    languages: strArr(content.languages),
    levelsSummary: (row.levels_summary as string) ?? "",
    studyAreas: (row.study_areas as string) ?? "",
    programmes: strArr(row.programmes),
    whyBullets: strArr(content.whyBullets),
    highlights: objArr(content.highlights, ["title", "body"]),
    why: objArr(content.why, ["title", "body"]),
    levels: objArr(content.levels, ["level", "note"]),
    courses,
    admissions: strArr(content.admissions),
    englishNote: typeof content.englishNote === "string" ? content.englishNote : "",
    budget: objArr(content.budget, ["label", "detail"]),
    budgetNote: typeof content.budgetNote === "string" ? content.budgetNote : "",
    scholarships: strArr(content.scholarships),
    life: strArr(content.life),
    faqs: objArr(content.faqs, ["q", "a"]),
    lat: row.lat != null ? String(row.lat) : "",
    lon: row.lon != null ? String(row.lon) : "",
    metaTitle: (row.meta_title as string) ?? "",
    metaDescription: (row.meta_description as string) ?? "",
    sections: normalizeSections(content.sections),
  };
}
