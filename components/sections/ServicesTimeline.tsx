"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SERVICES, SERVICE_PHASES, type ServicePhase } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The twelve services, grouped into the three journey stages, numbered 1–12. */
const PHASES = (Object.keys(SERVICE_PHASES) as ServicePhase[]).map((key) => ({
  key,
  label: SERVICE_PHASES[key],
  items: SERVICES.map((s, i) => ({ ...s, n: i + 1 })).filter((s) => s.phase === key),
}));

/**
 * A vertical timeline of the twelve services. As the list scrolls through the
 * viewport an accent line draws itself down the rail, each numbered node fills
 * in as the line reaches it, and each card slides up from behind a light blur.
 *
 * All of it collapses to a plain, fully-visible list under
 * `prefers-reduced-motion`.
 */
export default function ServicesTimeline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const rail = el.querySelector<HTMLElement>(".rail");
      const fill = el.querySelector<HTMLElement>(".rail-progress");
      const items = Array.from(el.querySelectorAll<HTMLElement>(".timeline-item"));
      const phaseLabels = Array.from(el.querySelectorAll<HTMLElement>(".timeline-phase"));
      const nums = items.map((it) => it.querySelector<HTMLElement>(".timeline-num"));
      if (!rail || !fill || !items.length || nums.some((n) => !n)) return;

      // Anchor the rail to the centre of the first and last node so the drawn
      // line starts and ends exactly on a dot. Recomputed whenever ScrollTrigger
      // remeasures (resize, font swap).
      const positionRail = () => {
        const cTop = el.getBoundingClientRect().top;
        const a = nums[0]!.getBoundingClientRect();
        const b = nums[nums.length - 1]!.getBoundingClientRect();
        const top = a.top - cTop + a.height / 2;
        gsap.set(rail, { top, height: Math.max(0, b.top - cTop + b.height / 2 - top) });
      };

      ScrollTrigger.addEventListener("refreshInit", positionRail);
      positionRail();

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
        gsap.set(phaseLabels, { opacity: 0, y: 14 });
        items.forEach((it) =>
          gsap.set(it.querySelector(".timeline-content"), {
            opacity: 0,
            x: -22,
            filter: "blur(6px)",
          }),
        );

        const triggers: ScrollTrigger[] = [];

        // the line follows the scroll
        triggers.push(
          ScrollTrigger.create({
            trigger: rail,
            start: "top 62%",
            end: "bottom 62%",
            scrub: 0.5,
            onUpdate: (self) => gsap.set(fill, { scaleY: self.progress }),
          }),
        );

        // node fills in when the leading edge passes it, and stays filled —
        // it reads as a progress marker, not a spotlight
        nums.forEach((num, i) => {
          triggers.push(
            ScrollTrigger.create({
              trigger: num,
              start: "center 62%",
              onEnter: () => items[i].classList.add("is-active"),
              onEnterBack: () => items[i].classList.add("is-active"),
              onLeaveBack: () => items[i].classList.remove("is-active"),
            }),
          );
        });

        // card slides up out of a light blur
        items.forEach((it) => {
          triggers.push(
            ScrollTrigger.create({
              trigger: it,
              start: "top 84%",
              once: true,
              onEnter: () =>
                gsap.to(it.querySelector(".timeline-content"), {
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                  duration: 0.6,
                  ease: "power3.out",
                }),
            }),
          );
        });

        // stage headings
        phaseLabels.forEach((p) => {
          triggers.push(
            ScrollTrigger.create({
              trigger: p,
              start: "top 88%",
              once: true,
              onEnter: () =>
                gsap.to(p, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }),
            }),
          );
        });

        return () => triggers.forEach((t) => t.kill());
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(fill, { scaleY: 1, transformOrigin: "top" });
        gsap.set(phaseLabels, { opacity: 1, y: 0 });
        items.forEach((it) => {
          it.classList.add("is-active");
          gsap.set(it.querySelector(".timeline-content"), {
            opacity: 1,
            x: 0,
            filter: "none",
          });
        });
      });

      const settle = window.setTimeout(() => ScrollTrigger.refresh(), 400);
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.clearTimeout(settle);
        window.removeEventListener("load", onLoad);
        ScrollTrigger.removeEventListener("refreshInit", positionRail);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="timeline relative">
      {/* the rail: a muted guide line with the accent line drawn over it */}
      <span
        aria-hidden="true"
        className="rail pointer-events-none absolute left-[21px] top-6 bottom-6 w-0.5 bg-line sm:left-[25px]"
      >
        <span
          className="rail-progress block h-full w-full origin-top bg-brand"
          style={{ transform: "scaleY(0)" }}
        />
      </span>

      <div className="space-y-16 pl-14 sm:pl-[4.5rem]">
        {PHASES.map((phase) => (
          <section key={phase.key} aria-label={phase.label}>
            <p className="timeline-phase label mb-8 text-brand">{phase.label}</p>
            <ol className="space-y-12">
              {phase.items.map((s) => (
                <li
                  key={s.anchor}
                  id={s.anchor}
                  className="timeline-item relative scroll-mt-28"
                >
                  <span className="timeline-num absolute -left-14 top-0 grid h-11 w-11 place-items-center rounded-full bg-white font-display text-[0.8125rem] font-extrabold tabular-nums text-brand ring-1 ring-brand/35 sm:-left-[4.5rem] sm:h-[3.25rem] sm:w-[3.25rem] sm:text-sm">
                    {String(s.n).padStart(2, "0")}
                  </span>
                  <div className="timeline-content">
                    <h3 className="timeline-title font-display text-xl font-bold leading-snug sm:text-[1.375rem]">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-[54ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                    <p className="mt-2.5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">
                      {s.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
