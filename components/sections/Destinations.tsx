import Link from "next/link";
import Button, { Arrow } from "@/components/ui/Button";
import Flag from "@/components/ui/Flag";
import { DESTINATIONS } from "@/content/site";

/**
 * The globe is rendered by GlobeStage on a fixed canvas behind this section.
 * Everything here is ordinary DOM sitting above it, so the section still reads
 * correctly with JavaScript disabled and on screens where the pinned sequence
 * is switched off.
 *
 * Spacing is deliberate: the heading clears the fixed site header, and the
 * card block ends just above where the globe's upper limb comes in.
 */
export default function Destinations() {
  return (
    <section
      id="destinations"
      className="relative w-full overflow-hidden bg-cream pb-24 pt-[11svh] lg:h-[100svh] lg:pb-0"
      aria-label="Popular study destinations"
    >
      <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="label text-brand">Where do you want to study?</p>
            <h2 className="mt-2.5 max-w-[26ch] text-[clamp(1.3rem,2.1vw,1.75rem)] font-extrabold leading-[1.15]">
              Six destinations. One decision that changes everything.
            </h2>
          </div>
          {/* `hidden` on <Button> loses to its own `inline-flex` base class, so
              hide via a wrapper — otherwise this shows on mobile and crushes
              the heading into a one-word-per-line column. */}
          <span className="hidden lg:contents">
            <Button href="/destinations" variant="outline" className="shrink-0">
              Explore All Destinations
            </Button>
          </span>
        </div>

        {/* Desktop: cards stack and swap on scroll. Elsewhere: a plain grid. */}
        <div className="relative mt-8 grid gap-5 sm:grid-cols-2 lg:mt-[3svh] lg:block lg:h-[34svh]">
          {DESTINATIONS.map((d, i) => (
            <article
              key={d.code}
              data-i={i}
              className="dest-card rounded-2xl bg-white/70 p-6 ring-1 ring-ink/8 backdrop-blur-sm lg:mx-auto lg:max-w-[46rem] lg:bg-transparent lg:p-0 lg:text-center lg:ring-0 lg:backdrop-blur-none"
            >
              <div className="flex items-center gap-3 lg:justify-center">
                <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full shadow-[0_4px_14px_-6px_rgba(23,23,23,0.5)] ring-2 ring-white">
                  <Flag code={d.code} className="h-9 w-9 rounded-full" title={d.name} />
                </span>
                <span className="label text-brand">
                  {String(i + 1).padStart(2, "0")} <span className="text-ink/30">/ 06</span>
                </span>
              </div>

              <h3 className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[0.95]">
                {d.name}
              </h3>
              <p className="mt-3 font-display text-[1.0625rem] font-semibold text-brand lg:text-xl">
                {d.headline}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft lg:mx-auto lg:max-w-[52ch] lg:text-base">
                {d.blurb}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2 lg:justify-center">
                {d.programmes.map((p) => (
                  <li
                    key={p}
                    className="rounded-full bg-white/80 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink-soft ring-1 ring-ink/8"
                  >
                    {p}
                  </li>
                ))}
              </ul>

              {/* Full button on mobile; on desktop the pinned view is tight,
                  so the CTA becomes a compact inline link. */}
              <div className="mt-6 lg:hidden">
                <Button href={`/${d.slug}`} variant="primary">
                  Explore {d.name}
                </Button>
              </div>
              <div className="mt-4 hidden lg:flex lg:justify-center">
                <Link
                  href={`/${d.slug}`}
                  className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-brand underline-offset-4 hover:underline"
                >
                  Explore {d.name}
                  <Arrow />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Progress rail — six steps, one per destination. Desktop only. */}
      <ol
        className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
        aria-hidden="true"
      >
        {DESTINATIONS.map((d, i) => (
          <li key={d.code}>
            <span
              data-i={i}
              className="dest-dot block h-6 w-[3px] origin-center rounded-full bg-ink/15"
            />
          </li>
        ))}
      </ol>

      <div className="mt-10 flex justify-center lg:hidden">
        <Button href="/destinations" variant="outline">
          Explore All Destinations
        </Button>
      </div>
    </section>
  );
}
