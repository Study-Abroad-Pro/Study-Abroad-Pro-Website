"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth scrolling. Lenis drives the scroll position and GSAP's ticker
 * drives Lenis, so both systems advance on the same frame — without that, pinned
 * sections and the globe drift apart by a frame and the handoff visibly stutters.
 *
 * We use Lenis rather than GSAP's ScrollSmoother (now free) on purpose: the
 * homepage globe sits *between* the hero's background and its text via a z-index
 * interleave, and ScrollSmoother's `#smooth-content` transform creates a
 * stacking context that breaks that. Lenis rides native scroll — no wrapper, no
 * stacking-context boundary — so the effect is site-wide with zero restructuring.
 *
 * `LERP` is the heaviness dial: lower = a longer, more momentum-style glide
 * (closer to ScrollSmoother's feel), higher = snappier. Skipped entirely for
 * `prefers-reduced-motion`.
 */
const LERP = 0.06;

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: LERP,
      smoothWheel: true,
      // Touch devices keep native momentum: hijacking it feels worse, not better.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Glide to same-page anchors (#counselling, #faq, …) instead of the
    // browser's instant hop, which Lenis would otherwise have to chase.
    const onAnchorClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.includes("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.pathname !== window.location.pathname || url.hash.length < 2) return;

      let target: Element | null = null;
      try {
        target = document.querySelector(url.hash);
      } catch {
        return;
      }
      if (!(target instanceof HTMLElement)) return;

      e.preventDefault();
      // Lenis already honours each target's own `scroll-margin-top`, so anchor
      // sections that need to clear the fixed header set `scroll-mt-*`; the rest
      // have enough top padding that no extra offset is wanted.
      lenis.scrollTo(target, { duration: 1.1 });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
