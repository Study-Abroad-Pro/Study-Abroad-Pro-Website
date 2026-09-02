import Button from "@/components/ui/Button";
import { DESTINATIONS } from "@/content/site";
import Flag from "@/components/ui/Flag";

export default function About() {
  return (
    <section id="about" className="relative z-20 bg-white py-24 sm:py-28">
      <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <p className="label text-brand" data-reveal>
            About us
          </p>
          <h2
            className="mt-4 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Your journey abroad deserves the right guidance.
          </h2>
          <div className="mt-7 flex max-w-[54ch] flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-soft">
            <p data-reveal>
              Studying abroad is more than getting admission to a university. It is choosing the
              right destination, the right course and the right path for what comes after — and
              those decisions are much harder to reverse than they look from here.
            </p>
            <p data-reveal>
              We work through your academic background, your budget and your career goal before
              recommending anything. Sometimes that means telling a student a country they had
              set their heart on is the wrong fit. That conversation is the job.
            </p>
            <p data-reveal>
              From the first counselling session to the week after you land, the aim is the
              same: fewer surprises, and a decision you can explain to yourself in five years.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3" data-reveal>
            <Button href="/about">Meet Our Team</Button>
            <Button href="#counselling" variant="outline">
              Talk to a Counsellor
            </Button>
          </div>
        </div>

        {/* Destination index — the six we actually work in, as a factual list
            rather than another set of claims. */}
        <div className="lg:pt-16" data-reveal>
          <div className="rounded-2xl bg-paper p-7 ring-1 ring-ink/8 sm:p-9">
            <p className="label text-ink/50">Where we work</p>
            <ul className="mt-6 divide-y divide-line">
              {DESTINATIONS.map((d) => (
                <li key={d.code} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-white shadow-[0_3px_10px_-5px_rgba(23,23,23,0.5)]">
                    <Flag code={d.code} className="h-8 w-8 rounded-full" title={d.name} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[0.9375rem] font-bold">{d.name}</span>
                    <span className="block truncate text-[0.8125rem] text-muted">
                      {d.programmes.slice(0, 3).join(" · ")}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-[0.875rem] leading-relaxed text-muted">
              France, Sweden, the Netherlands, the UAE and Singapore are being added as we build
              the university relationships to support them properly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
