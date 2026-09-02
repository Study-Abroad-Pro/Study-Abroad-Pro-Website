import Button from "@/components/ui/Button";
import { SERVICES } from "@/content/site";

/**
 * Twelve services as a numbered index rather than twelve cards. Cards would
 * give each item equal visual weight and turn the section into a grid of
 * boxes; an index reads as a checklist of what is covered, which is the actual
 * message — that nothing in the journey is left to the student.
 */
export default function Services() {
  return (
    <section id="services" className="relative z-20 bg-white py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
        <p className="label text-brand" data-reveal>
          Our services
        </p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Everything the journey needs. Twelve things, in order.
          </h2>
          <p className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            Counselling through to the week after you land. Most of these matter long before a
            student thinks to ask about them.
          </p>
        </div>

        <ol className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <li key={service.title} className="flex gap-5 border-t border-line pt-5" data-reveal>
              <span className="label mt-1 shrink-0 tabular-nums text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-[1.0625rem] font-bold leading-snug">
                  {service.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{service.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16" data-reveal>
          <Button href="/services" variant="outline">
            See How Each One Works
          </Button>
        </div>
      </div>
    </section>
  );
}
