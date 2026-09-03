"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DESTINATIONS } from "@/content/site";
import {
  globe,
  HERO_ANCHOR,
  SPIN_BASE,
  STAGE_ANCHOR,
  resetGlobe,
  spinForLongitude,
} from "./globeState";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

/** Full pinned choreography. Everything else gets a lighter treatment. */
const FULL = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const LITE = "(prefers-reduced-motion: no-preference) and ((max-width: 1023px) or (pointer: coarse))";
const STILL = "(prefers-reduced-motion: reduce)";

/**
 * Portrait composition for the globe. On a phone the hero copy sticks to the
 * top for a little over one screen (the sticky rule in globals.css) while the
 * globe turns in place; then it sinks and fades out and the page scrolls on.
 * The globe must be gone before the destinations section arrives — its fixed
 * canvas paints on top of those cards.
 *
 * Dials — tune against a real device, a WebGL globe can't be previewed in a
 * headless build. `cy` lower = globe sits lower; `radius` bigger = fills more
 * width; `M_HOLD` is the sticky scroll window and MUST match the 220svh/100svh
 * split in globals.css; `M_SPLIT` is turn time vs sink-and-fade time.
 */
const M_HERO = { cx: 0.05, cy: -0.85, radius: 0.9 };
/** Radians the globe turns across the mobile hero hold. */
const M_TURNS = -Math.PI * 3;
/** Length of the sticky "hold" (== 220svh − 100svh in globals.css). */
const M_HOLD = "+=120%";
/** Fraction of the hold spent turning before the globe sinks + fades. */
const M_SPLIT = 0.72;

/**
 * Owns the one persistent WebGL canvas and every ScrollTrigger that drives it.
 * Keeping the whole sequence in a single file is deliberate: hero and
 * destinations are one continuous piece of choreography, and splitting it
 * across components is how these things drift out of sync.
 */
export default function GlobeStage() {
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useGSAP(() => {
    resetGlobe();
    const mm = gsap.matchMedia();

    /* ------------------------------------------------------------------ */
    /* Desktop: pin, scrub, three turns, then six destinations            */
    /* ------------------------------------------------------------------ */
    mm.add(FULL, () => {
      // The desktop sequence renders continuously; only LITE parks the loop, so
      // reclaim it here in case we arrived from a resize that had parked it.
      setFrameloop("always");
      // Re-seat the globe at the hero anchor: a resize up from the mobile
      // branch leaves it wherever that sequence parked it.
      resetGlobe();
      gsap.set(".dest-card", { opacity: 0, y: 60, filter: "blur(12px)" });
      gsap.set(".hero-outro", { opacity: 0, y: 30 });

      // Phase A — the hero holds for three full turns.
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 1 / 3, 2 / 3, 1],
            duration: { min: 0.2, max: 0.5 },
            delay: 0.06,
            ease: "power2.inOut",
          },
        },
      });

      heroTl
        .to(globe, { spin: SPIN_BASE, duration: 1, ease: "none" }, 0)
        // the sky keeps some of its warmth rather than going flat
        .to(".hero-sky", { opacity: 0.45, duration: 0.5, ease: "power1.out" }, 0)
        .to(".hero-copy", { opacity: 0, y: -70, duration: 0.5, ease: "power2.in" }, 0)
        .to(".hero-cue", { opacity: 0, duration: 0.18 }, 0)
        .to(".hero-stats", { opacity: 0, y: 40, duration: 0.5, ease: "power2.in" }, 0)
        .to(".hero-student", { opacity: 0, y: 70, scale: 0.96, duration: 0.44, ease: "power2.in" }, 0.04)
        .to(".hero-arcline", { opacity: 0, duration: 0.44, ease: "none" }, 0.06)
        .to(".hero-flag", { opacity: 0, y: -46, stagger: 0.05, duration: 0.4, ease: "power2.in" }, 0.06)
        // The destinations heading arrives while the third turn is still
        // running, so the screen is never just a spinning ball on bare ground.
        .fromTo(
          ".hero-outro",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          0.66,
        );

      // Phase B — the handoff. Starts exactly where the hero pin releases.
      // cx/cy/radius are tweened as a fromTo with constant endpoints: the globe
      // position lives on a plain object shared with the render loop, and a
      // bare `.to()` here would record its start lazily. A ScrollTrigger.refresh
      // that lands mid-handoff (fired on load, resize or font settle) then
      // re-captures that start from a half-moved globe, and scrolling back to
      // the top no longer returns it to the hero anchor — it stays centred and
      // oversized, in front of the traveller.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#destinations",
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
            invalidateOnRefresh: true,
            // Snap the shared globe object to the exact anchor whenever the
            // handoff range is crossed outright (a scrollbar drag, a hash jump,
            // Home/End). Scrub alone eases toward the target over ~0.5s, which
            // after an instant jump can leave the globe stranded between anchors.
            onLeaveBack: () => {
              globe.cx = HERO_ANCHOR.cx;
              globe.cy = HERO_ANCHOR.cy;
              globe.radius = HERO_ANCHOR.radius;
            },
            onLeave: () => {
              globe.cx = STAGE_ANCHOR.cx;
              globe.cy = STAGE_ANCHOR.cy;
              globe.radius = STAGE_ANCHOR.radius;
            },
          },
        })
        .fromTo(
          globe,
          { cx: HERO_ANCHOR.cx, cy: HERO_ANCHOR.cy, radius: HERO_ANCHOR.radius },
          {
            cx: STAGE_ANCHOR.cx,
            cy: STAGE_ANCHOR.cy,
            radius: STAGE_ANCHOR.radius,
            ease: "power2.inOut",
            duration: 1,
          },
          0,
        )
        .to(
          globe,
          {
            spin: SPIN_BASE + spinForLongitude(DESTINATIONS[0].lon),
            ease: "power2.inOut",
            duration: 1,
          },
          0,
        );

      // Phase C — one viewport-height of scroll per destination.
      const last = DESTINATIONS.length - 1;
      const destTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#destinations",
          start: "top top",
          end: `+=${DESTINATIONS.length * 100}%`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.floor(self.progress * DESTINATIONS.length + 0.12);
            globe.active = Math.max(0, Math.min(last, i));
          },
          // Coming back up out of the destinations pin, make sure the canvas is
          // opaque again even if the exit was an instant jump past the tail fade.
          onLeaveBack: () => {
            globe.opacity = 1;
          },
        },
      });

      DESTINATIONS.forEach((d, i) => {
        if (i > 0) {
          destTl
            .to(
              `.dest-card[data-i="${i - 1}"]`,
              { opacity: 0, y: -50, filter: "blur(10px)", duration: 0.32, ease: "power2.in" },
              i,
            )
            .to(
              globe,
              { spin: SPIN_BASE + spinForLongitude(d.lon), duration: 0.68, ease: "power2.inOut" },
              i,
            );
        }
        const at = i + (i === 0 ? 0.04 : 0.3);
        destTl
          .fromTo(
            `.dest-card[data-i="${i}"]`,
            { opacity: 0, y: 60, filter: "blur(12px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.46, ease: "power3.out" },
            at,
          )
          .to(
            `.dest-dot[data-i="${i}"]`,
            { backgroundColor: "#ff320d", scaleY: 1.7, duration: 0.3, ease: "power2.out" },
            at,
          );
        if (i > 0) {
          destTl.to(
            `.dest-dot[data-i="${i - 1}"]`,
            { backgroundColor: "rgba(23,23,23,0.15)", scaleY: 1, duration: 0.3, ease: "power2.out" },
            at,
          );
        }
      });

      // Tail: let the last card breathe, then fade the whole canvas out. Only
      // Phase B is allowed to touch cx/cy/radius — a second scrubbed tween on
      // those here would, once played, clamp them to its own start pose whenever
      // the page is scrolled back above the destinations pin, and Phase B could
      // no longer return the globe to the hero anchor. OpacitySync flips the
      // canvas to visibility:hidden as opacity hits zero, so the fade alone is
      // enough to take it out of the compositor.
      const tail = DESTINATIONS.length;
      destTl
        .to({}, { duration: 0.5 }, tail)
        .to(
          `.dest-card[data-i="${last}"]`,
          { opacity: 0, y: -50, filter: "blur(10px)", duration: 0.3, ease: "power2.in" },
          tail + 0.18,
        )
        .fromTo(
          globe,
          { opacity: 1 },
          { opacity: 0, duration: 0.32, ease: "none", immediateRender: false },
          tail + 0.24,
        );

      // The loop stays on "always" for the whole desktop sequence. A single
      // shaded sphere costs a fraction of a millisecond per frame, and once the
      // sequence has scrolled past, OpacitySync hides the canvas so the browser
      // stops compositing it anyway. Parking the loop from a ScrollTrigger whose
      // endTrigger is itself pinned proved unreliable after a full scroll
      // round-trip — it would leave the canvas frozen on a stale frame with the
      // globe oversized and in front of the traveller.
    });

    /* ------------------------------------------------------------------ */
    /* Touch and small screens: sticky hero "hold", no ScrollTrigger pin   */
    /* ------------------------------------------------------------------ */
    mm.add(LITE, () => {
      // One shaded sphere is cheap and OpacitySync drops the canvas from the
      // compositor once it fades, so the loop stays on for the whole sequence.
      setFrameloop("always");

      globe.cx = M_HERO.cx;
      globe.cy = M_HERO.cy;
      globe.radius = M_HERO.radius;
      globe.opacity = 1;
      globe.active = -1;
      globe.spin = 0;
      gsap.set(".dest-card", { opacity: 1, y: 0, filter: "none" });
      gsap.set(".hero-student", { clearProps: "opacity,transform" });

      // The hero copy is held by `position: sticky` (globals.css) for `M_HOLD`
      // of scroll. This scrubbed timeline runs over exactly that window: the
      // globe turns, then sinks + fades — it has to reach opacity 0 before the
      // copy unsticks, because the fixed canvas paints on top of what's next.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: M_HOLD,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl
        .to(globe, { spin: M_TURNS, ease: "none", duration: M_SPLIT }, 0)
        .fromTo(
          ".hero-student",
          { opacity: 1, y: 0 },
          { opacity: 0, y: 60, ease: "power1.in", duration: 0.55 },
          0.16,
        )
        .fromTo(
          globe,
          { cy: M_HERO.cy },
          { cy: M_HERO.cy - 0.45, ease: "power1.in", duration: 1 - M_SPLIT, immediateRender: false },
          M_SPLIT,
        )
        // Fade finishes a touch before the copy unsticks, so the canvas is gone
        // by the time the next section scrolls under it.
        .fromTo(
          globe,
          { opacity: 1 },
          { opacity: 0, ease: "power1.in", duration: (1 - M_SPLIT) * 0.72, immediateRender: false },
          M_SPLIT,
        );

      // A smooth, simple staggered entrance for the flag chips the first time
      // they're on screen.
      const chips = gsap.utils.toArray<HTMLElement>(".hero-flag-chip");
      const chipsIn = chips.length
        ? gsap.from(chips, {
            opacity: 0,
            y: 14,
            scale: 0.7,
            transformOrigin: "50% 100%",
            stagger: 0.06,
            duration: 0.5,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: { trigger: ".hero-flag-strip", start: "top 92%", once: true },
          })
        : null;

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        chipsIn?.scrollTrigger?.kill();
        chipsIn?.kill();
      };
    });

    /* ------------------------------------------------------------------ */
    /* Reduced motion: the globe is there, it simply does not move         */
    /* ------------------------------------------------------------------ */
    mm.add(STILL, () => {
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      globe.cx = mobile ? M_HERO.cx : HERO_ANCHOR.cx;
      globe.cy = mobile ? M_HERO.cy : -1.7;
      globe.radius = mobile ? M_HERO.radius : 0.88;
      globe.opacity = 1;
      globe.spin = SPIN_BASE + spinForLongitude(DESTINATIONS[0].lon);
      globe.active = -1;
      gsap.set(".dest-card", { opacity: 1, y: 0, filter: "none" });
      // Left on "always": the scene is static, so this costs one small sphere
      // per frame, and switching to "never" would mean nothing ever paints.
      setFrameloop("always");
    });

    // Pin distances are computed from measured heights, so remeasure once the
    // webfonts and hero artwork have settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  return <GlobeCanvas frameloop={frameloop} />;
}
