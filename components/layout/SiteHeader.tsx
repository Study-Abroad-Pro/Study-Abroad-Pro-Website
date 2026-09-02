"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/content/site";

export default function SiteHeader({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // Lets the sticky mobile CTA in the layout hide itself while the menu is up.
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  // Once you scroll away from the top, the bar picks up a frosted-cream
  // background so the logo no longer floats over the content behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
          solid
            ? "pointer-events-auto border-b border-ink/8 bg-cream/85 shadow-[0_1px_16px_-10px_rgba(23,17,14,0.35)] backdrop-blur-md"
            : "pointer-events-none border-b border-transparent bg-transparent"
        }`}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-[86rem] items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/" aria-label={`${SITE.name} — home`} className="block">
            <Image
              src="/brand/logo-orange.webp"
              alt={SITE.name}
              width={720}
              height={322}
              priority
              className="h-11 w-auto sm:h-[3.25rem]"
            />
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              aria-label="Call us"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-black/5 backdrop-blur-sm transition-colors hover:text-brand"
            >
              <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.5 14.1v2.1a1.4 1.4 0 0 1-1.5 1.4 13.9 13.9 0 0 1-6-2.2 13.6 13.6 0 0 1-4.2-4.2 13.9 13.9 0 0 1-2.2-6.1A1.4 1.4 0 0 1 5 3.6h2.1a1.4 1.4 0 0 1 1.4 1.2c.1.7.3 1.3.5 1.9a1.4 1.4 0 0 1-.3 1.5l-.9.9a11.2 11.2 0 0 0 4.2 4.2l.9-.9a1.4 1.4 0 0 1 1.5-.3c.6.2 1.2.4 1.9.5a1.4 1.4 0 0 1 1.2 1.5z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-black/5 backdrop-blur-sm transition-colors hover:text-brand"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <nav
          id="site-menu"
          /* z-[45]: above the hero's own z-40 layers (copy, stat bar, scroll
             cue) — those are not pinned on mobile and would otherwise show
             through — but below the header (z-50) so the close button works.
             The inner min-h-full + justify-center centres a short menu and
             still scrolls a tall one (e.g. landscape). */
          className="fixed inset-0 z-[45] overflow-y-auto bg-ink text-cream"
        >
          <div className="flex min-h-full flex-col justify-center gap-1 px-8 py-24 sm:px-16">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-[1.15] tracking-tight transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#counselling"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex w-fit rounded-full bg-brand px-7 py-3.5 text-[0.9375rem] font-semibold text-white"
            >
              Book Free Counselling
            </Link>
          </div>
        </nav>
      ) : null}
    </>
  );
}
