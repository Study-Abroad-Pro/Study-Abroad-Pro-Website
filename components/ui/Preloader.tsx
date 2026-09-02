"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** First full load: never flash quicker than this, never block longer. */
const MIN_VISIBLE_MS = 550;
const MAX_VISIBLE_MS = 2200;

/** Route change: show for at least this long... */
const NAV_MIN_MS = 360;
/** ...and at least this long after the next page is actually ready. */
const NAV_SETTLE_MS = 140;
/** Give up if a navigation never resolves (link to nowhere, cancelled). */
const NAV_CAP_MS = 8000;

/** Must match the opacity transition on `.preloader.is-done` in globals.css. */
const FADE_MS = 450;

// useLayoutEffect warns during SSR; on the client it runs the nav replay before
// paint, so the incoming page never flashes before the splash covers it.
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Brand splash. Shown on a full page load (dismissed on `window.load`, capped
 * so a slow asset can't trap the visitor) and replayed as a wipe on every
 * client-side navigation within the site — it appears the moment an internal
 * link is clicked and clears once the next page is ready.
 *
 * Lives in `app/(site)/layout.tsx`, so it renders in the initial HTML and only
 * covers the public site — not `/admin`. globals.css carries a keyframe
 * fallback that hides it even if this component's JavaScript never runs.
 */
export default function Preloader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"show" | "done" | "hidden">("show");
  // Bumped on each navigation so the inner logo/bar remount and re-animate.
  const [navKey, setNavKey] = useState(0);
  const isFirstPath = useRef(true);
  const navStart = useRef(0);
  const cap = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCap = () => {
    if (cap.current) clearTimeout(cap.current);
    cap.current = null;
  };

  // ---- first full page load ----
  useEffect(() => {
    const start = performance.now();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      window.setTimeout(() => setPhase("done"), wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    const c = window.setTimeout(finish, MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(c);
    };
  }, []);

  // ---- show the splash the moment an internal navigation starts ----
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
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
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page / #anchor
      if (url.pathname.startsWith("/admin")) return; // admin brings its own chrome

      navStart.current = performance.now();
      setPhase("show");
      setNavKey((k) => k + 1);
      clearCap();
      cap.current = setTimeout(() => setPhase("done"), NAV_CAP_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // ---- navigation finished: hold briefly, then fade (runs before paint) ----
  useIsoLayoutEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    clearCap();
    const shownFor = navStart.current
      ? performance.now() - navStart.current
      : 0;
    const wait = Math.max(NAV_SETTLE_MS, NAV_MIN_MS - shownFor);

    // Also covers back/forward and router.push(), where no click fired.
    setPhase("show");
    setNavKey((k) => k + 1);
    navStart.current = 0;

    const t = window.setTimeout(() => setPhase("done"), wait);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // ---- unmount once the fade has finished ----
  useEffect(() => {
    if (phase !== "done") return;
    const t = window.setTimeout(() => setPhase("hidden"), FADE_MS + 80);
    return () => window.clearTimeout(t);
  }, [phase, navKey]);

  useEffect(() => clearCap, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`preloader${navKey > 0 ? " is-nav" : ""}${
        phase === "done" ? " is-done" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="preloader-inner" key={navKey}>
        {/* A plain <img> on purpose: a splash screen must not wait on the
            Next.js image optimizer round-trip. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-orange.webp"
          alt="Study Abroad Pro"
          width={720}
          height={322}
          className="preloader-logo"
          fetchPriority="high"
        />
        <span className="preloader-bar" aria-hidden="true">
          <span />
        </span>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
