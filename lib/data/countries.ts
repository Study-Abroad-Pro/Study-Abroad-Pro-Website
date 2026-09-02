import { unstable_cache } from "next/cache";
import { getPublicSupabase, storageUrl } from "@/lib/supabase/public";
import { normalizeSections, type SectionVisibility } from "@/lib/countries-sections";

/**
 * Read model for the public site's country content. Backed by the `countries`
 * table (seeded from `content/countries.ts`), edited in `/admin/countries`.
 *
 * Cached with the `countries` tag — the admin server actions call
 * `revalidateTag("countries")` so an edit is live within a request or two.
 *
 * NOTE: the homepage globe still reads `DESTINATIONS` from `content/site.ts`
 * for its build-time coordinates; only the country *pages* and the
 * `/destinations` content come from here.
 */

export type Stat = { value: string; label: string };
export type TitleBody = { title: string; body: string };
export type CountryPageData = {
  slug: string;
  code: string;
  name: string;
  flagUrl: string | null;
  headline: string;
  intro: string;
  lede: string;
  metaTitle: string | null;
  metaDescription: string | null;
  stats: Stat[];
  highlights: TitleBody[];
  why: TitleBody[];
  levels: { level: string; note: string }[];
  courses: { group: string; items: string[] }[];
  admissions: string[];
  englishNote: string;
  budget: { label: string; detail: string }[];
  budgetNote: string;
  scholarships: string[];
  life: string[];
  faqs: { q: string; a: string }[];
  sections: SectionVisibility;
};

export type DestinationCard = {
  code: string;
  slug: string;
  name: string;
  flagUrl: string | null;
  intro: string;
  programmes: string[];
  whyBullets: string[];
  studyAreas: string;
  levels: string;
};

type Row = Record<string, unknown>;

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function toPageData(row: Row): CountryPageData {
  const content = (row.content ?? {}) as Row;
  const flagKey = str(row.flag_path);
  return {
    slug: str(row.slug),
    code: str(row.code),
    name: str(row.name),
    flagUrl: flagKey ? storageUrl("media", flagKey) : null,
    headline: str(row.headline),
    intro: str(row.intro),
    lede: str(row.lede),
    metaTitle: (row.meta_title as string) ?? null,
    metaDescription: (row.meta_description as string) ?? null,
    stats: arr<Stat>(row.stats),
    highlights: arr<TitleBody>(content.highlights),
    why: arr<TitleBody>(content.why),
    levels: arr<{ level: string; note: string }>(content.levels),
    courses: arr<{ group: string; items: string[] }>(content.courses),
    admissions: arr<string>(content.admissions),
    englishNote: str(content.englishNote),
    budget: arr<{ label: string; detail: string }>(content.budget),
    budgetNote: str(content.budgetNote),
    scholarships: arr<string>(content.scholarships),
    life: arr<string>(content.life),
    faqs: arr<{ q: string; a: string }>(content.faqs),
    sections: normalizeSections(content.sections),
  };
}

/** Slugs of every published country — for `generateStaticParams`. */
export const getPublishedCountrySlugs = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await getPublicSupabase()
      .from("countries")
      .select("slug")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return (data ?? []).map((r) => r.slug);
  },
  ["published-country-slugs"],
  { tags: ["countries"] },
);

/** Full page content for one published country, or null. */
export const getCountryPage = unstable_cache(
  async (slug: string): Promise<CountryPageData | null> => {
    const { data } = await getPublicSupabase()
      .from("countries")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ? toPageData(data as Row) : null;
  },
  ["country-page"],
  { tags: ["countries"] },
);

/** Compact cards for the `/destinations` page, in sort order. */
export const getDestinationCards = unstable_cache(
  async (): Promise<DestinationCard[]> => {
    const { data } = await getPublicSupabase()
      .from("countries")
      .select("code, slug, name, flag_path, intro, programmes, study_areas, levels_summary, content")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    return (data ?? []).map((r) => {
      const content = (r.content ?? {}) as Row;
      return {
        code: r.code,
        slug: r.slug,
        name: r.name,
        flagUrl: r.flag_path ? storageUrl("media", r.flag_path) : null,
        intro: r.intro ?? "",
        programmes: r.programmes ?? [],
        whyBullets: arr<string>(content.whyBullets),
        studyAreas: r.study_areas ?? "",
        levels: r.levels_summary ?? "",
      };
    });
  },
  ["destination-cards"],
  { tags: ["countries"] },
);
