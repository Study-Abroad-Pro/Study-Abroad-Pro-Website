import QuickCounsellingForm from "@/components/forms/QuickCounsellingForm";
import { getSiteContact } from "@/lib/data/settings";
import { getFormsConfig, getPreferredCountryOptions } from "@/lib/data/forms";

/**
 * The primary conversion point. The surrounding copy, which optional fields
 * appear and the dropdown options are all editable at `/admin/forms`; name,
 * phone and email are always required.
 */
export default async function Counselling() {
  const [{ phone }, config, countryOptions] = await Promise.all([
    getSiteContact(),
    getFormsConfig(),
    getPreferredCountryOptions(),
  ]);
  const c = config.counselling;

  return (
    <section id="counselling" className="relative z-20 bg-cream py-24 sm:py-28">
      <div className="mx-auto grid w-full max-w-[86rem] items-start gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="label text-brand" data-reveal>
            {c.eyebrow}
          </p>
          <h2
            className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            {c.heading}
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            {c.intro}
          </p>

          {c.bullets.length > 0 && (
            <ul className="mt-8 flex flex-col gap-3.5" data-reveal>
              {c.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-ink-soft">
                  <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16.5 5.5L8 14l-4.5-4.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 text-[0.9375rem] text-muted" data-reveal>
            Prefer to talk?{" "}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold text-brand underline-offset-4 hover:underline">
              {phone}
            </a>
          </p>
        </div>

        <div data-reveal>
          <QuickCounsellingForm
            countryOptions={countryOptions}
            courseOptions={config.courseOptions}
            fields={c.fields}
            copy={{
              submitLabel: c.submitLabel,
              reassurance: c.reassurance,
              successHeading: c.successHeading,
              successBody: c.successBody,
            }}
          />
        </div>
      </div>
    </section>
  );
}
