"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * One batched reveal for every `[data-reveal]` element below the globe
 * sequence. Batching matters: the homepage has around sixty revealable
 * elements, and sixty individual ScrollTriggers each doing their own
 * measurement is exactly how a page like this starts to feel heavy.
 *
 * Elements sharing a `data-reveal-group` animate together with a stagger, so a
 * row of cards arrives as a row rather than as unrelated pieces.
 */
export default function ScrollReveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: 26 });

      const batch = ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        batchMax: 8,
        onEnter: (targets) =>
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: "power3.out",
            stagger: 0.07,
            overwrite: true,
          }),
      });

      return () => {
        batch.forEach((t) => t.kill());
        gsap.set(items, { clearProps: "opacity,transform" });
      };
    });

    // Reduced motion: everything is simply present.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-reveal]", { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  return null;
}
