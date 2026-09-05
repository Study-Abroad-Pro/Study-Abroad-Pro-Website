"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Arrow } from "@/components/ui/Button";
import type { CourseCategoryGroup } from "@/lib/data/courses";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 flex-none text-ink/40 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Mobile-only accordion for the /courses category browser — one collapsible
 * card per category (name, course count, chevron), expanding to the course
 * list. Tablet and up keep the always-open grid in app/(site)/courses/page.tsx;
 * this component is hidden at `sm:` and above.
 */
export default function CourseCategoryAccordion({
  groups,
}: {
  groups: CourseCategoryGroup[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const base = useId();

  return (
    <div className="flex flex-col gap-3 sm:hidden">
      {groups.map((group) => {
        const isOpen = openKey === group.key;
        const buttonId = `${base}-${group.key}-button`;
        const panelId = `${base}-${group.key}-panel`;

        return (
          <div
            key={group.key}
            className="rounded-2xl border border-line bg-white"
            data-reveal
          >
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : group.key)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              id={buttonId}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <span className="flex flex-col gap-1">
                <span className="font-display text-lg font-bold leading-snug">
                  {group.label}
                </span>
                <span className="text-sm text-muted">
                  {group.courses.length} course{group.courses.length === 1 ? "" : "s"} available
                </span>
              </span>
              <Chevron open={isOpen} />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="border-t border-line"
            >
              <ul className="divide-y divide-line px-5 pb-2">
                {group.courses.map((course) => (
                  <li key={course.slug}>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="flex flex-col gap-1">
                        <span className="font-display text-base font-bold leading-snug group-hover:text-brand">
                          {course.name}
                        </span>
                        <span className="text-[0.875rem] leading-relaxed text-muted">
                          {course.summary}
                        </span>
                      </span>
                      <span className="shrink-0 text-brand">
                        <Arrow />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
