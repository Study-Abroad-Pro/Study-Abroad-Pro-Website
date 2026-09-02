import Link from "next/link";
import Button from "@/components/ui/Button";
import { COURSE_GROUPS } from "@/content/site";
import { slugify } from "@/lib/utils";

/**
 * Twenty-four courses grouped into four fields rather than listed flat. A flat
 * grid of twenty-four chips is a wall; grouped, a visitor finds their field
 * first and scans one short list.
 */
export default function PopularCourses() {
  return (
    <section id="courses" className="relative z-20 bg-cream py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
        <p className="label text-brand" data-reveal>
          Popular courses
        </p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Career-focused programmes, not a course catalogue.
          </h2>
          <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            Every course below is offered across our six destinations at different levels and
            entry requirements. Which one fits depends on your background — that is the
            conversation, not a dropdown.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {COURSE_GROUPS.map((group) => (
            <div key={group.category} data-reveal>
              <div className="flex items-baseline gap-3 border-b border-ink/10 pb-4">
                <h3 className="font-display text-xl font-extrabold tracking-tight">
                  {group.category}
                </h3>
                <span className="label text-ink/35">{group.courses.length}</span>
              </div>
              <p className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted">
                {group.note}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.courses.map((course) => (
                  <li key={course}>
                    <Link
                      href={`/courses/${slugify(course)}`}
                      className="inline-flex rounded-full bg-white/70 px-3.5 py-2 text-[0.875rem] font-medium text-ink-soft ring-1 ring-ink/8 transition-colors hover:bg-white hover:text-brand hover:ring-brand/40"
                    >
                      {course}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16" data-reveal>
          <Button href="/courses" variant="outline">
            Explore All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}
