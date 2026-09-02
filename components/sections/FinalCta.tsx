import Link from "next/link";
import { Arrow } from "@/components/ui/Button";

/**
 * The page closes on the same line it opened with. Full-bleed brand orange —
 * the only place on the homepage where orange carries a whole section, which
 * is what keeps it emphatic instead of decorative.
 */
export default function FinalCta() {
  return (
    <section className="relative z-20 overflow-hidden bg-brand py-24 text-white sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_82%_10%,rgba(255,255,255,0.18),transparent_65%)]"
      />
      <div className="relative mx-auto flex w-full max-w-[86rem] flex-col items-start gap-10 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            className="max-w-[14ch] text-[clamp(2.2rem,5.2vw,4rem)] font-extrabold leading-[0.98]"
            data-reveal
          >
            Your future has no borders.
          </h2>
          <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-white/85" data-reveal>
            Take the first step with someone who will tell you what is realistic, not what is
            easy to sell.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3" data-reveal>
          <Link
            href="#counselling"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[0.9375rem] font-semibold text-brand transition-transform duration-300 hover:-translate-y-0.5"
          >
            Book Free Counselling
            <Arrow />
          </Link>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[0.9375rem] font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
          >
            Contact Us
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
