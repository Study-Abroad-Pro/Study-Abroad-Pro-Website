/**
 * One-off seed: pushes the static `content/*.ts` data into Supabase so the
 * admin panel and (later) the public pages can read from Postgres instead.
 *
 * Run from the `sap/` folder with the service-role key available:
 *   node --env-file=.env.local scripts/seed.ts
 *
 * Safe to re-run: every write is an upsert keyed on a natural unique column.
 * The admin panel is the source of truth after this runs — edits made there
 * are NOT reflected back into the content files.
 */

import { createClient } from "@supabase/supabase-js";
import {
  DESTINATIONS,
  DESTINATION_ORDER,
  HERO_STATS,
  TRUST_LINE,
  SITE,
} from "../content/site.ts";
import { COUNTRY_CONTENT } from "../content/countries.ts";
import { BLOG_POSTS } from "../content/blog.ts";
import { COURSES, COURSE_CONTENT, COURSE_CATEGORIES } from "../content/courses.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Run with:  node --env-file=.env.local scripts/seed.ts",
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seedCountries() {
  const rows = DESTINATIONS.map((d) => {
    const cc = COUNTRY_CONTENT[d.code];
    const order = DESTINATION_ORDER.indexOf(d.code);
    return {
      slug: d.slug,
      code: d.code,
      name: d.name,
      short: d.short,
      sort_order: order === -1 ? 99 : order,
      headline: d.headline,
      lede: cc.lede,
      blurb: d.blurb,
      intro: d.intro,
      hero_path: null,
      flag_path: null,
      stats: cc.stats,
      lat: d.lat,
      lon: d.lon,
      programmes: d.programmes,
      study_areas: d.studyAreas,
      levels_summary: d.levels,
      content: {
        // The admin country editor reads these structured arrays; the seed's
        // stats[] carry the same intakes/languages as display text.
        intakes: (cc.stats[0]?.value ?? "").split("·").map((s) => s.trim()).filter(Boolean),
        languages: (cc.stats[1]?.value ?? "").split(/[·&]/).map((s) => s.trim()).filter(Boolean),
        // Every country-page section on by default; admins toggle per country.
        sections: {
          highlights: true, why: true, levels: true, courses: true,
          admissions: true, english: true, budget: true, scholarships: true,
          life: true, faqs: true,
        },
        whyBullets: d.why,
        highlights: cc.highlights,
        why: cc.why,
        levels: cc.levels,
        courses: cc.courses,
        admissions: cc.admissions,
        englishNote: cc.englishNote,
        budget: cc.budget,
        budgetNote: cc.budgetNote,
        scholarships: cc.scholarships,
        life: cc.life,
        faqs: cc.faqs,
      },
      meta_title: `Study in ${d.name} | ${SITE.name}`,
      meta_description: cc.lede,
      is_published: true,
    };
  });

  const { error } = await db.from("countries").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`countries: ${error.message}`);
  console.log(`  countries      ${rows.length} upserted`);
}

async function seedBlogPosts() {
  const rows = BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    cover_path: null,
    body_md: p.body,
    author: p.author,
    is_published: true,
    published_at: new Date(p.date).toISOString(),
  }));

  const { error } = await db.from("blog_posts").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`blog_posts: ${error.message}`);
  console.log(`  blog_posts     ${rows.length} upserted`);
}

async function seedCourses() {
  const categoryLabel = new Map(COURSE_CATEGORIES.map((c) => [c.key, c.label]));

  const rows = COURSES.map((course, i) => {
    const cc = COURSE_CONTENT[course.slug];
    if (!cc) throw new Error(`courses: missing COURSE_CONTENT for "${course.slug}"`);
    return {
      slug: course.slug,
      name: course.name,
      category: categoryLabel.get(course.category) ?? course.category,
      summary: course.summary,
      sort_order: i,
      is_published: true,
      headline: cc.headline,
      lede: cc.lede,
      intro: cc.intro,
      levels: cc.levels,
      content: {
        about: cc.about,
        whatYouStudy: cc.whatYouStudy,
        whoFor: cc.whoFor,
        careers: cc.careers,
        careersNote: cc.careersNote,
        admissionsNote: cc.admissionsNote ?? "",
        feesNote: cc.feesNote ?? "",
        whyNote: cc.whyNote ?? "",
      },
      meta_title: `${cc.headline} | Study Abroad Pro`,
      meta_description: cc.lede,
    };
  });

  const { error } = await db.from("courses").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`courses: ${error.message}`);
  console.log(`  courses        ${rows.length} upserted`);
}

async function seedSiteSettings() {
  const row = {
    id: true,
    contact: {
      phone: SITE.phone,
      whatsapp: SITE.whatsapp,
      email: SITE.email,
      address: SITE.address,
    },
    homepage: {
      tagline: SITE.tagline,
      description: SITE.description,
      heroStats: HERO_STATS,
      trustLine: TRUST_LINE,
    },
  };

  const { error } = await db.from("site_settings").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`site_settings: ${error.message}`);
  console.log("  site_settings  1 upserted");
}

async function main() {
  console.log("Seeding Supabase from content/*.ts ...");
  await seedCountries();
  await seedCourses();
  await seedBlogPosts();
  await seedSiteSettings();
  console.log("Done.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
