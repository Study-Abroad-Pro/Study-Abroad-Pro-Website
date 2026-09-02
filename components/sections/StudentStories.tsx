import Flag from "@/components/ui/Flag";
import Button from "@/components/ui/Button";
import { TESTIMONIALS, TESTIMONIALS_ARE_SAMPLES } from "@/content/site";

/**
 * The brief is explicit that student names, universities and outcomes must not
 * be invented. So while `TESTIMONIALS_ARE_SAMPLES` is true, every card carries
 * a visible Sample marker and the section states plainly that real stories are
 * still being collected.
 *
 * That is not a placeholder shortcut — it is the honest version of this
 * section, and it means the layout is finished and reviewed at realistic text
 * lengths before any real quote exists. Swap the content and flip the flag and
 * the markers disappear with no other change.
 */
export default function StudentStories() {
  return (
    <section id="stories" className="relative z-20 bg-cream py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
        <p className="label text-brand" data-reveal>
          Student success
        </p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Dreams started here. Success followed.
          </h2>
          {TESTIMONIALS_ARE_SAMPLES ? (
            <p
              className="max-w-[44ch] rounded-xl bg-white/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-ink-soft ring-1 ring-brand/30"
              data-reveal
            >
              <strong className="font-semibold">Sample layout.</strong> These are not real
              students. Every quote we publish will be a real one, with the student&rsquo;s
              consent — nothing here is invented to fill the space.
            </p>
          ) : (
            <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              Every quote below is from a student we worked with, published with their consent.
            </p>
          )}
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <li
              key={i}
              className="relative flex flex-col gap-6 rounded-2xl bg-white p-7 ring-1 ring-ink/8"
              data-reveal
            >
              {TESTIMONIALS_ARE_SAMPLES ? (
                <span className="absolute right-5 top-5 rounded-full bg-brand-tint px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-deep">
                  Sample
                </span>
              ) : null}

              <svg viewBox="0 0 24 18" className="h-5 w-6 text-brand/30" fill="currentColor" aria-hidden="true">
                <path d="M0 18V9.6C0 4.3 3.1.9 8.4 0l.9 2.7C6.6 3.5 5 5.2 5 7.4h3.6V18H0zm14.4 0V9.6c0-5.3 3.1-8.7 8.4-9.6l.9 2.7c-2.7.8-4.3 2.5-4.3 4.7H23V18h-8.6z" />
              </svg>

              <p className="flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-white shadow-[0_4px_12px_-6px_rgba(23,23,23,0.5)]">
                  <Flag code={t.countryCode} className="h-9 w-9 rounded-full" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[0.9375rem] font-bold">
                    {t.name}
                  </span>
                  <span className="block truncate text-[0.8125rem] text-muted">
                    {t.course} · {t.university}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-wrap items-center gap-3" data-reveal>
          <Button href="/stories" variant="outline">
            Read Student Stories
          </Button>
          {TESTIMONIALS_ARE_SAMPLES ? (
            <p className="text-[0.875rem] text-muted">
              Studied with us? We would like to publish your story.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
