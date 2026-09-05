import { unstable_cache } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import { COURSE_CATEGORIES, type CourseCategoryKey } from "@/content/courses";

/**
 * Read model for the public site's course content. Backed by the `courses`
 * table (seeded from `content/courses.ts`), edited in `/admin/courses`.
 *
 * Cached with the `courses` tag — the admin server actions call
 * `revalidateTag("courses")` so an edit is live within a request or two.
 */

export type CoursePageData = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  headline: string;
  lede: string;
  intro: string;
  levels: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  about: string[];
  whatYouStudy: string[];
  whoFor: string[];
  careers: string[];
  careersNote: string;
  admissionsNote: string;
  feesNote: string;
  whyNote: string;
};

export type CourseCard = {
  slug: string;
  name: string;
  category: string;
  summary: string;
};

export type CourseCategoryGroup = {
  key: CourseCategoryKey;
  label: string;
  blurb: string;
  exploreLabel: string;
  courses: CourseCard[];
};

type Row = Record<string, unknown>;

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function toPageData(row: Row): CoursePageData {
  const content = (row.content ?? {}) as Row;
  return {
    slug: str(row.slug),
    name: str(row.name),
    category: str(row.category),
    summary: str(row.summary),
    headline: str(row.headline),
    lede: str(row.lede),
    intro: str(row.intro),
    levels: arr<string>(row.levels),
    metaTitle: (row.meta_title as string) ?? null,
    metaDescription: (row.meta_description as string) ?? null,
    about: arr<string>(content.about),
    whatYouStudy: arr<string>(content.whatYouStudy),
    whoFor: arr<string>(content.whoFor),
    careers: arr<string>(content.careers),
    careersNote: str(content.careersNote),
    admissionsNote: str(content.admissionsNote),
    feesNote: str(content.feesNote),
    whyNote: str(content.whyNote),
  };
}

/** Slugs of every published course — for `generateStaticParams`. */
export const getPublishedCourseSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await getPublicSupabase()
      .from("courses")
      .select("slug")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return (data ?? []).map((r) => r.slug);
  },
  ["published-course-slugs"],
  { tags: ["courses"] },
);

/** Full page content for one published course, or null. */
export const getCoursePage = unstable_cache(
  async (slug: string): Promise<CoursePageData | null> => {
    const { data } = await getPublicSupabase()
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ? toPageData(data as Row) : null;
  },
  ["course-page"],
  { tags: ["courses"] },
);

/** Every published course, grouped by category in the site's fixed category order. */
export const getCourseCategoryGroups = unstable_cache(
  async (): Promise<CourseCategoryGroup[]> => {
    const { data } = await getPublicSupabase()
      .from("courses")
      .select("slug, name, category, summary, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    const rows = data ?? [];
    return COURSE_CATEGORIES.map((cat) => ({
      key: cat.key,
      label: cat.label,
      blurb: cat.blurb,
      exploreLabel: cat.exploreLabel,
      courses: rows
        .filter((r) => r.category === cat.label)
        .map((r) => ({
          slug: r.slug,
          name: r.name,
          category: r.category,
          summary: r.summary ?? "",
        })),
    })).filter((group) => group.courses.length > 0);
  },
  ["course-category-groups"],
  { tags: ["courses"] },
);
