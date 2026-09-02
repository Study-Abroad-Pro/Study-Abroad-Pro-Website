import Button from "@/components/ui/Button";
import { STEPS } from "@/content/site";

/**
 * The one dark section on the page. It breaks up a long run of light sections
 * and gives the process — the thing a hesitant visitor actually wants to
 * understand — its own moment instead of another cream panel.
 *
 * Numbered because this genuinely is a sequence: step four cannot happen
 * before step three.
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-20 overflow-hidden bg-ink py-24 text-cream sm:py-28">
      {/* a single warm bloom, so the dark panel is not flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_78%_18%,rgba(255,50,13,0.16),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
        <p className="label text-brand" data-reveal>
          How it works
        </p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Your journey. Simplified.
          </h2>
          <p className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-cream/70" data-reveal>
            Six steps from the first conversation to your first week abroad. You will always
            know which one you are on.
          </p>
        </div>

        <ol className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} data-reveal>
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[0.9375rem] font-extrabold tabular-nums text-brand ring-1 ring-brand/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* connector: present between steps, absent on the last of each row */}
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-cream/25 to-transparent"
                />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold leading-snug">{step.title}</h3>
              <p className="mt-2.5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-cream/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16" data-reveal>
          <Button href="#counselling">Start Your Journey</Button>
        </div>
      </div>
    </section>
  );
}
