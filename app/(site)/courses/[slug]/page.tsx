import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import ScrollReveals from "@/components/motion/ScrollReveals";
import Counselling from "@/components/sections/Counselling";
import FinalCta from "@/components/sections/FinalCta";
import {
  COURSE_ADMISSION_FRAMEWORK,
  COURSE_FEES_TEXT,
  COURSE_JOURNEY_STEPS,
} from "@/content/courses";
import { getCoursePage, getPublishedCourseSlugs } from "@/lib/data/courses";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Content comes from the `courses` table. Published slugs are pre-rendered;
// dynamicParams:true lets a newly published course render on first request.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCoursePage(slug);
  if (!c) return {};
  return {
    title: c.metaTitle ? { absolute: c.metaTitle } : c.headline,
    description:
      c.metaDescription ??
      `${c.lede} Study levels, what you may study, admission requirements and career areas for ${c.name} abroad.`,
    alternates: { canonical: `/courses/${c.slug}` },
    openGraph: {
      type: "website",
      url: `/courses/${c.slug}`,
      title: `${c.headline} — Study Abroad Pro`,
      description: c.lede,
    },
  };
}

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 flex-none text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.5 5.5 8 14l-4.5-4.5" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-ink/25"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getCoursePage(slug);
  if (!c) notFound();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Courses", item: `${siteUrl}/courses` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${siteUrl}/courses/${c.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ---- 1 · hero ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_84%_-12%,rgba(255,50,13,0.1),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <nav aria-label="Breadcrumb" className="label text-ink/40">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href="/courses" className="hover:text-brand">
              Courses
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-ink/60">{c.name}</span>
          </nav>

          <p className="label mt-10 text-brand">{c.category}</p>
          <h1 className="mt-4 max-w-[22ch] text-[clamp(2.3rem,5.4vw,4.2rem)] font-extrabold leading-[0.98]">
            {c.headline}
          </h1>
          <p className="mt-7 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
            {c.lede}
          </p>
          {c.intro && (
            <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted">
              {c.intro}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/destinations">Find {c.name} Programs</Button>
            <Button href="#counselling" variant="outline">
              Check My Eligibility
            </Button>
          </div>
        </div>
      </section>

      {/* ---- 2 · about ---- */}
      {c.about.length > 0 && (
        <section className="relative z-20 bg-white py-24 sm:py-28">
          <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
            <p className="label text-brand" data-reveal>
              About {c.name}
            </p>
            <h2
              className="mt-4 max-w-[24ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              What this field is about.
            </h2>
            <div className="mt-8 flex max-w-[64ch] flex-col gap-4">
              {c.about.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-[1.0625rem] leading-relaxed text-ink-soft"
                  data-reveal
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- 3 · what you may study ---- */}
      {c.whatYouStudy.length > 0 && (
        <section className="relative z-20 bg-cream py-24 sm:py-28">
          <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
            <p className="label text-brand" data-reveal>
              Curriculum
            </p>
            <h2
              className="mt-4 max-w-[22ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              What You May Study
            </h2>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              Course content varies between institutions, but {c.name.toLowerCase()}-related
              studies may include:
            </p>

            <ul className="mt-10 flex flex-wrap gap-3">
              {c.whatYouStudy.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white px-4 py-2.5 text-[0.9375rem] font-medium text-ink-soft ring-1 ring-ink/8"
                  data-reveal
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- 4 · study levels ---- */}
      {c.levels.length > 0 && (
        <section className="relative z-20 bg-white py-24 sm:py-28">
          <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
            <p className="label text-brand" data-reveal>
              Study levels
            </p>
            <h2
              className="mt-4 max-w-[22ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              Where you can enter.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              Depending on the destination and your academic profile,{" "}
              {c.name.toLowerCase()}-related programmes may be available at
              different levels.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3" data-reveal>
              {c.levels.map((level, i) => (
                <span key={level} className="flex items-center gap-3">
                  <span className="rounded-full bg-ink px-5 py-2.5 font-display text-[0.9375rem] font-bold text-cream">
                    {level}
                  </span>
                  {i < c.levels.length - 1 && (
                    <span className="text-ink/25" aria-hidden="true">
                      |
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- 5 · where can I study ---- */}
      <section className="relative z-20 bg-paper py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <div
            className="flex flex-col gap-6 rounded-2xl bg-white p-8 ring-1 ring-ink/8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
            data-reveal
          >
            <div>
              <p className="label text-brand">Destinations</p>
              <h2 className="mt-3 max-w-[28ch] text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold leading-[1.1]">
                Where Can I Study {c.name}?
              </h2>
              <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                Explore {c.name.toLowerCase()} and related programmes across
                suitable Study Abroad Pro destinations.
              </p>
            </div>
            <Button href="/destinations" variant="outline" className="shrink-0">
              Explore Destinations
            </Button>
          </div>
        </div>
      </section>

      {/* ---- 6 · who is this for ---- */}
      {c.whoFor.length > 0 && (
        <section className="relative z-20 bg-white py-24 sm:py-28">
          <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="label text-brand" data-reveal>
                Fit
              </p>
              <h2
                className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
                data-reveal
              >
                Who Is This Course For?
              </h2>
              <p className="mt-6 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
                {c.name} may suit students interested in:
              </p>
            </div>

            <ul className="flex flex-col gap-4" data-reveal>
              {c.whoFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- 7 · career areas ---- */}
      {c.careers.length > 0 && (
        <section className="relative z-20 bg-cream py-24 sm:py-28">
          <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
            <p className="label text-brand" data-reveal>
              Career areas
            </p>
            <h2
              className="mt-4 max-w-[22ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              Where this can lead.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              Depending on qualifications, licensing requirements and the
              destination, graduates may explore areas such as:
            </p>

            <ul className="mt-10 flex flex-wrap gap-3">
              {c.careers.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white px-4 py-2.5 text-[0.9375rem] font-medium text-ink-soft ring-1 ring-ink/8"
                  data-reveal
                >
                  {item}
                </li>
              ))}
            </ul>

            {c.careersNote && (
              <p
                className="mt-8 max-w-[64ch] rounded-xl bg-white/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-ink-soft ring-1 ring-brand/25"
                data-reveal
              >
                {c.careersNote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ---- 8 · admission requirements ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Admission requirements
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              What you&rsquo;ll usually need.
            </h2>
            <p className="mt-6 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              Requirements vary depending on the country, institution and level
              of study. Common considerations may include:
            </p>
            <div className="mt-8" data-reveal>
              <Button href="#counselling" variant="outline">
                Check My Eligibility
              </Button>
            </div>
          </div>

          <div data-reveal>
            <ul className="flex flex-col gap-4">
              {COURSE_ADMISSION_FRAMEWORK.map((item) => (
                <li key={item.slice(0, 24)} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
            {c.admissionsNote && (
              <p className="mt-6 max-w-[64ch] rounded-xl bg-paper px-5 py-4 text-[0.9375rem] leading-relaxed text-ink-soft ring-1 ring-brand/25">
                <strong className="font-semibold">For {c.name}:</strong> {c.admissionsNote}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---- 9 · fees & study costs ---- */}
      <section className="relative z-20 bg-paper py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Fees &amp; study costs
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            What drives the cost.
          </h2>
          <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            {COURSE_FEES_TEXT}
          </p>
          {c.feesNote && (
            <p
              className="mt-6 max-w-[64ch] rounded-xl bg-white/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-ink-soft ring-1 ring-brand/25"
              data-reveal
            >
              <strong className="font-semibold">For {c.name}:</strong> {c.feesNote}
            </p>
          )}
          <div className="mt-8" data-reveal>
            <Button href="#counselling" variant="outline">
              Discuss My Budget
            </Button>
          </div>
        </div>
      </section>

      {/* ---- 10 · why study this abroad ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Why go abroad
          </p>
          <h2
            className="mt-4 max-w-[24ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Why Study {c.name} Abroad?
          </h2>
          <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            {c.whyNote ||
              `Studying ${c.name.toLowerCase()} internationally can provide exposure to different professional environments, educational systems and cultures while developing academic and professional knowledge.`}
          </p>
        </div>
      </section>

      {/* ---- 11 · how we help ---- */}
      <section className="relative z-20 overflow-hidden bg-ink py-24 text-cream sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_82%_14%,rgba(255,50,13,0.16),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            How Study Abroad Pro helps
          </p>
          <h2
            className="mt-4 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            From course to campus, one team the whole way.
          </h2>

          <ol className="mt-14 flex flex-wrap items-center gap-x-2 gap-y-4" data-reveal>
            {COURSE_JOURNEY_STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-4 py-2 text-[0.875rem] font-semibold text-cream ring-1 ring-white/15">
                  {step}
                </span>
                {i < COURSE_JOURNEY_STEPS.length - 1 && <Arrow />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- 12 · final cta ---- */}
      <section className="relative z-20 bg-cream py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <div
            className="flex flex-col gap-6 rounded-2xl bg-white p-8 ring-1 ring-ink/8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
            data-reveal
          >
            <div>
              <h2 className="max-w-[28ch] text-[clamp(1.4rem,2.8vw,2rem)] font-extrabold leading-[1.1]">
                Interested in Studying {c.name} Abroad?
              </h2>
              <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                Tell us about your academic profile and career goals, and let us
                help you explore suitable options.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button href="#counselling">Check My Eligibility</Button>
              <Button href="#counselling" variant="outline">
                Book Free Counselling
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Counselling />
      <FinalCta />

      <ScrollReveals />
    </>
  );
}
