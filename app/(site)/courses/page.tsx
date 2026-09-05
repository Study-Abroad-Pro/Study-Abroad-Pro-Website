import type { Metadata } from "next";
import Link from "next/link";
import Button, { Arrow } from "@/components/ui/Button";
import ScrollReveals from "@/components/motion/ScrollReveals";
import Counselling from "@/components/sections/Counselling";
import FinalCta from "@/components/sections/FinalCta";
import { COURSE_FINDER_FACTORS } from "@/content/courses";
import { getCourseCategoryGroups } from "@/lib/data/courses";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Explore career-focused courses across healthcare, technology, engineering, business, hospitality, education and science — and find one that matches your background and goals.",
  alternates: { canonical: "/courses" },
  openGraph: {
    type: "website",
    url: "/courses",
    title: "Courses — Study Abroad Pro",
    description: "Find the right course. Build the right future.",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Courses", item: `${siteUrl}/courses` },
  ],
};

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

export default async function CoursesPage() {
  const groups = await getCourseCategoryGroups();

  const coursesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: groups
      .flatMap((g) => g.courses)
      .map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: `${siteUrl}/courses/${c.slug}`,
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesLd) }}
      />

      {/* ---- 1 · hero ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(54%_62%_at_86%_-12%,rgba(255,50,13,0.1),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <nav aria-label="Breadcrumb" className="label text-ink/40">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-ink/60">Courses</span>
          </nav>

          <p className="label mt-10 text-brand">Courses</p>
          <h1 className="mt-4 max-w-[18ch] text-[clamp(2.3rem,5.4vw,4.2rem)] font-extrabold leading-[0.98]">
            Find the Right Course. Build the Right Future.
          </h1>
          <p className="mt-7 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
            Explore career-focused programmes across leading international study
            destinations and discover a course that matches your interests,
            academic background and future goals.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#browse">Explore Courses</Button>
            <Button href="#course-finder" variant="outline">
              Get Free Course Guidance
            </Button>
          </div>
        </div>
      </section>

      {/* ---- 2 · browse by field ---- */}
      <section id="browse" className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Explore popular courses
          </p>
          <h2
            className="mt-4 max-w-[24ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            What Do You Want to Study?
          </h2>
          <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            From healthcare and technology to business, engineering and
            hospitality, explore study options across a wide range of fields.
          </p>

          <div className="mt-16 flex flex-col gap-20">
            {groups.map((group) => (
              <div key={group.key} id={group.key} className="scroll-mt-24">
                <h3
                  className="border-b border-line pb-4 font-display text-xl font-extrabold tracking-tight sm:text-2xl"
                  data-reveal
                >
                  {group.label}
                </h3>

                <ul className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {group.courses.map((course) => (
                    <li key={course.slug} data-reveal>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="group flex flex-col gap-2"
                      >
                        <h4 className="font-display text-lg font-bold leading-snug group-hover:text-brand">
                          {course.name}
                        </h4>
                        <p className="text-[0.9375rem] leading-relaxed text-muted">
                          {course.summary}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-brand">
                          Explore course
                          <Arrow />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-10" data-reveal>
                  <Link
                    href="#course-finder"
                    className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-brand underline-offset-4 hover:underline"
                  >
                    {group.exploreLabel}
                    <Arrow />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 3 · course finder ---- */}
      <section id="course-finder" className="relative z-20 overflow-hidden bg-ink py-24 text-cream sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_82%_14%,rgba(255,50,13,0.16),transparent_70%)]"
        />
        <div className="relative mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Course finder
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              Not Sure What to Study?
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-cream/75" data-reveal>
              Choosing a course is one of the most important decisions in your
              study-abroad journey. Our counsellors can help you explore
              suitable programmes based on your:
            </p>
            <div className="mt-9" data-reveal>
              <Button href="#counselling">Help Me Find a Course</Button>
            </div>
          </div>

          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2" data-reveal>
            {COURSE_FINDER_FACTORS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-cream/85">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- 4 · conversion ---- */}
      <Counselling />
      <FinalCta />

      <ScrollReveals />
    </>
  );
}
