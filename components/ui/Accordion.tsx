"use client";

import { useId, useState } from "react";

type Item = { q: string; a: string };

/**
 * Accordion built on buttons and `aria-expanded` rather than <details>, so the
 * open/close height can be animated and the panel keeps a stable id for
 * screen readers. One item open at a time — with seven FAQs, letting them all
 * open at once just makes the section long.
 */
export default function Accordion({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} data-reveal>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`${base}-panel-${i}`}
                id={`${base}-button-${i}`}
                className="group flex w-full items-start gap-5 py-5 text-left"
              >
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full ring-1 ring-ink/15 transition-colors group-hover:ring-brand">
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3 text-brand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M2 6h8" />
                    <path
                      d="M6 2v8"
                      className={`origin-center transition-transform duration-300 ${
                        isOpen ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </svg>
                </span>
                <span className="flex-1 font-display text-[1.0625rem] font-semibold leading-snug transition-colors group-hover:text-brand sm:text-lg">
                  {item.q}
                </span>
              </button>
            </h3>
            <div
              id={`${base}-panel-${i}`}
              role="region"
              aria-labelledby={`${base}-button-${i}`}
              hidden={!isOpen}
            >
              <p className="max-w-[62ch] pb-6 pl-11 text-[0.9375rem] leading-relaxed text-muted">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
