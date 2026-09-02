"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DESTINATION_JOURNEY } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "From choosing a country to boarding your flight" — the seven steps as a
 * flight path. A dashed line runs the length of the list; a solid accent line
 * draws down it as the section scrolls, and each step's marker fills in behind
 * the leading edge. Collapses to a plain list under `prefers-reduced-motion`.
 */
export default function DestinationJourney() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const fill = el.querySelector<HTMLElement>(".journey-fill");
      const plane = el.querySelector<HTMLElement>(".journey-plane");
      const steps = Array.from(el.querySelectorAll<HTMLElement>(".journey-step"));
      if (!fill || !plane || !steps.length) return;

      const total = steps.length;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
        gsap.set(plane, { top: "0%", opacity: 0 });
        gsap.set(steps, { opacity: 0, y: 22 });

        const triggers: ScrollTrigger[] = [];

        // steps arrive one after another
        steps.forEach((step, i) => {
          triggers.push(
            ScrollTrigger.create({
              trigger: step,
              start: "top 85%",
              once: true,
              onEnter: () =>
                gsap.to(step, {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  ease: "power3.out",
                  delay: (i % 2) * 0.05,
                }),
            }),
          );
        });

        // the accent line and the plane follow the scroll
        triggers.push(
          ScrollTrigger.create({
            trigger: el.querySelector(".journey-track"),
            start: "top 58%",
            end: "bottom 62%",
            scrub: 0.6,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(fill, { scaleY: p });
              gsap.set(plane, { top: `${p * 100}%`, opacity: p > 0.01 && p < 0.995 ? 1 : 0 });
              const reached = Math.round(p * total);
              steps.forEach((s, i) => s.classList.toggle("is-active", i < reached));
            },
          }),
        );

        return () => triggers.forEach((t) => t.kill());
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(fill, { scaleY: 1, transformOrigin: "top" });
        gsap.set(plane, { opacity: 0 });
        gsap.set(steps, { opacity: 1, y: 0 });
        steps.forEach((s) => s.classList.add("is-active"));
      });

      const settle = window.setTimeout(() => ScrollTrigger.refresh(), 400);
      return () => {
        window.clearTimeout(settle);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section className="relative z-20 overflow-hidden bg-ink py-24 text-cream sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_82%_12%,rgba(255,50,13,0.16),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
        <p className="label text-brand" data-reveal>
          Study destination journey
        </p>
        <h2
          className="mt-4 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
          data-reveal
        >
          From choosing a country to boarding your flight.
        </h2>

        <div ref={root} className="mt-16">
          <div className="journey-track relative pl-14 sm:pl-16">
            {/* dashed flight path + the accent line drawn over it + the plane */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[19px] top-3 bottom-3 border-l-2 border-dashed border-cream/25 sm:left-[23px]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[19px] top-3 bottom-3 w-0.5 sm:left-[23px]"
            >
              <span
                className="journey-fill block h-full w-full origin-top bg-brand"
                style={{ transform: "scaleY(0)" }}
              />
            </span>
            <span
              aria-hidden="true"
              className="journey-plane absolute left-[20px] z-10 -translate-x-1/2 -translate-y-1/2 text-brand sm:left-[24px]"
              style={{ opacity: 0 }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink ring-1 ring-brand/50">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M10 1.6c.7 0 1.2.9 1.2 2.4v3.2l6 3.5v1.8l-6-1.9v3.3l1.9 1.4v1.4L10 17l-3.1.9v-1.4l1.9-1.4v-3.3l-6 1.9v-1.8l6-3.5V4c0-1.5.5-2.4 1.2-2.4z" />
                </svg>
              </span>
            </span>

            <ol className="space-y-11">
              {DESTINATION_JOURNEY.map((step, i) => (
                <li key={step.title} className="journey-step relative">
                  <span className="journey-num absolute -left-14 top-0 grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-[0.8125rem] font-extrabold tabular-nums text-brand ring-1 ring-brand/35 sm:-left-16 sm:h-12 sm:w-12 sm:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-cream/65">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
