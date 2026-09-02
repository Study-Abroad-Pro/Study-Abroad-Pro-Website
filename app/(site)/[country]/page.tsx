import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Flag from "@/components/ui/Flag";
import Accordion from "@/components/ui/Accordion";
import ScrollReveals from "@/components/motion/ScrollReveals";
import Counselling from "@/components/sections/Counselling";
import FinalCta from "@/components/sections/FinalCta";
import { SERVICES } from "@/content/site";
import {
  COUNTRY_APPLICATION_JOURNEY,
  ENGLISH_FRAMEWORK,
} from "@/content/countries";
import { getCountryPage, getPublishedCountrySlugs } from "@/lib/data/countries";
import { normalizeSections } from "@/lib/countries-sections";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Content comes from the `countries` table. Published slugs are pre-rendered;
// dynamicParams:true lets a newly published country render on first request.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedCountrySlugs();
  return slugs.map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = await getCountryPage(country);
  if (!c) return {};
  const inName = c.code === "gb" ? "the UK" : c.name;
  return {
    // metaTitle from the DB is a full title (it may already include the brand);
    // `absolute` stops the layout template appending "| Study Abroad Pro" again.
    title: c.metaTitle ? { absolute: c.metaTitle } : `Study in ${c.name}`,
    description:
      c.metaDescription ??
      `${c.lede} Programmes, study levels, admission and English requirements, budget, scholarships and the application journey for studying in ${inName}.`,
    alternates: { canonical: `/${c.slug}` },
    openGraph: {
      type: "website",
      url: `/${c.slug}`,
      title: `Study in ${c.name} — Study Abroad Pro`,
      description: c.lede,
    },
  };
}

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 flex-none text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.5 5.5 8 14l-4.5-4.5" />
    </svg>
  );
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = await getCountryPage(country);
  if (!c) notFound();

  // Re-normalise in case a cached record predates the `sections` field.
  const sections = normalizeSections(c.sections);
  const inName = c.code === "gb" ? "the UK" : c.name;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Study Destinations",
        item: `${siteUrl}/destinations`,
      },
      { "@type": "ListItem", position: 3, name: `Study in ${c.name}`, item: `${siteUrl}/${c.slug}` },
    ],
  };

  const showFaqs = sections.faqs && c.faqs.length > 0;
  const faqLd = showFaqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* ---- 1 · hero ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_84%_-12%,rgba(255,50,13,0.1),transparent_70%)]"
        />
        <div className="relative mx-auto grid w-full max-w-[86rem] gap-12 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <nav aria-label="Breadcrumb" className="label text-ink/40">
              <Link href="/" className="hover:text-brand">
                Home
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <Link href="/destinations" className="hover:text-brand">
                Study Destinations
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="text-ink/60">{c.name}</span>
            </nav>

            <p className="label mt-10 text-brand">Study in {inName}</p>
            <h1 className="mt-4 max-w-[16ch] text-[clamp(2.3rem,5.4vw,4.2rem)] font-extrabold leading-[0.98]">
              {c.headline}
            </h1>
            <p className="mt-7 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
              {c.lede}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#counselling">Book Free Counselling</Button>
              <Button href="/courses" variant="outline">
                Explore Courses
              </Button>
            </div>

            <dl className="mt-12 grid max-w-[38rem] grid-cols-3 gap-x-6 gap-y-2 border-t border-line pt-6">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-[0.9375rem] font-extrabold leading-tight sm:text-base">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-[0.75rem] leading-snug text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="mx-auto grid aspect-square w-full max-w-[22rem] place-items-center rounded-full bg-white shadow-[0_40px_80px_-40px_rgba(23,17,14,0.4)] ring-1 ring-ink/5">
              <span className="grid h-[62%] w-[62%] place-items-center overflow-hidden rounded-full shadow-[0_16px_40px_-16px_rgba(23,17,14,0.5)] ring-4 ring-white">
                <Flag code={c.code} src={c.flagUrl} className="h-full w-full rounded-full" title={c.name} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2 · highlights ---- */}
      {sections.highlights && (
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            {c.name} highlights
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            What stands out about studying here.
          </h2>

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {c.highlights.map((h, i) => (
              <li key={h.title} className="border-t border-line pt-6" data-reveal>
                <span className="label text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl font-bold leading-snug">{h.title}</h3>
                <p className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
                  {h.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ---- 3 · why ---- */}
      {sections.why && (
      <section className="relative z-20 bg-cream py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Why {inName}?
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              The case for this destination.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              {c.intro}
            </p>
          </div>

          <ul className="flex flex-col gap-9">
            {c.why.map((w) => (
              <li key={w.title} data-reveal>
                <h3 className="font-display text-lg font-bold sm:text-xl">{w.title}</h3>
                <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                  {w.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ---- 4 · study levels ---- */}
      {sections.levels && (
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Study levels
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Where you can enter, and what each level means.
          </h2>

          <ul className="mt-14 divide-y divide-line border-y border-line">
            {c.levels.map((l) => (
              <li key={l.level} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8" data-reveal>
                <h3 className="font-display text-[1.0625rem] font-bold">{l.level}</h3>
                <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted">{l.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ---- 5 · popular courses ---- */}
      {sections.courses && (
      <section className="relative z-20 bg-paper py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Popular courses
          </p>
          <h2
            className="mt-4 max-w-[22ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Fields students choose {inName} for.
          </h2>

          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {c.courses.map((group) => (
              <div key={group.group} data-reveal>
                <h3 className="border-b border-ink/10 pb-3 font-display text-lg font-extrabold tracking-tight">
                  {group.group}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-white px-3.5 py-2 text-[0.875rem] font-medium text-ink-soft ring-1 ring-ink/8"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14" data-reveal>
            <Button href="/courses" variant="outline">
              Explore all courses
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* ---- 6 · course finder ---- */}
      <section className="relative z-20 bg-white py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <div
            className="flex flex-col gap-6 rounded-2xl bg-cream p-8 ring-1 ring-ink/8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
            data-reveal
          >
            <div>
              <p className="label text-brand">Course finder</p>
              <h2 className="mt-3 max-w-[26ch] text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold leading-[1.1]">
                Not sure which course in {inName} fits your background?
              </h2>
              <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                Tell us your qualification, your budget and where you want to end
                up working. We shortlist programmes that are a realistic match —
                not a dropdown of everything.
              </p>
            </div>
            <Button href="#counselling" className="shrink-0">
              Get my shortlist
            </Button>
          </div>
        </div>
      </section>

      {/* ---- 7 · admission requirements ---- */}
      {sections.admissions && (
      <section className="relative z-20 bg-paper py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Admission requirements
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              What you&rsquo;ll usually need.
            </h2>
            <p className="mt-6 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              Exact requirements are set by each institution and programme. This
              is the common ground.
            </p>
          </div>

          <ul className="flex flex-col gap-4" data-reveal>
            {c.admissions.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ---- 8 · english requirements ---- */}
      {sections.english && (
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            English requirements
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            How the English requirement actually works.
          </h2>

          <ul className="mt-12 flex max-w-[64ch] flex-col gap-4">
            {ENGLISH_FRAMEWORK.map((para) => (
              <li
                key={para.slice(0, 24)}
                className="flex items-start gap-3 text-[1rem] leading-relaxed text-ink-soft"
                data-reveal
              >
                <Check />
                {para}
              </li>
            ))}
          </ul>

          {c.englishNote && (
            <p
              className="mt-8 max-w-[64ch] rounded-xl bg-paper px-5 py-4 text-[0.9375rem] leading-relaxed text-ink-soft ring-1 ring-brand/25"
              data-reveal
            >
              <strong className="font-semibold">In {inName}:</strong>{" "}
              {c.englishNote}
            </p>
          )}
        </div>
      </section>
      )}

      {/* ---- 9 · tuition & budget ---- */}
      {sections.budget && (
      <section className="relative z-20 bg-cream py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Tuition &amp; budget
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            What drives the cost.
          </h2>

          <ul className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
            {c.budget.map((b) => (
              <li key={b.label} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8" data-reveal>
                <h3 className="font-display text-[1.0625rem] font-bold">{b.label}</h3>
                <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-soft">{b.detail}</p>
              </li>
            ))}
          </ul>

          {c.budgetNote && (
            <p
              className="mt-8 max-w-[64ch] rounded-xl bg-white/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-ink-soft ring-1 ring-brand/25"
              data-reveal
            >
              <strong className="font-semibold">Why no single number:</strong>{" "}
              {c.budgetNote}
            </p>
          )}
        </div>
      </section>
      )}

      {/* ---- 10 · scholarships ---- */}
      {sections.scholarships && (
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Scholarships
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              The kinds of funding worth chasing.
            </h2>
            <p className="mt-6 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              Named awards change every cycle. These are the categories, and how
              we work them.
            </p>
          </div>

          <ul className="flex flex-col gap-4" data-reveal>
            {c.scholarships.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ---- 11 · application journey ---- */}
      <section className="relative z-20 overflow-hidden bg-ink py-24 text-cream sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_82%_14%,rgba(255,50,13,0.16),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Application journey
          </p>
          <h2
            className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            From counselling to your arrival in {inName}.
          </h2>

          <ol className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTRY_APPLICATION_JOURNEY.map((step, i) => (
              <li key={step.title} data-reveal>
                <span className="grid h-11 w-11 place-items-center rounded-full font-display text-[0.9375rem] font-extrabold tabular-nums text-brand ring-1 ring-brand/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug">{step.title}</h3>
                <p className="mt-2.5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-cream/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- 12 · student support ---- */}
      <section className="relative z-20 bg-paper py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Student support
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              You don&rsquo;t do this part alone.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              The same team carries your {inName} plan from the first conversation
              to your first week on campus.
            </p>
            <div className="mt-8" data-reveal>
              <Button href="/services" variant="outline">
                See how each one works
              </Button>
            </div>
          </div>

          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2" data-reveal>
            {SERVICES.map((s) => (
              <li key={s.title} className="flex items-start gap-2.5 text-[0.9375rem] text-ink-soft">
                <Check />
                {s.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- 13 · student life ---- */}
      {sections.life && (
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Student life
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            What day-to-day life tends to look like.
          </h2>

          <ul className="mt-14 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {c.life.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-t border-line pt-5 text-[0.9375rem] leading-relaxed text-ink-soft"
                data-reveal
              >
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ---- 14 · faq ---- */}
      {showFaqs && (
      <section className="relative z-20 bg-paper py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-12 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Questions
            </p>
            <h2
              className="mt-4 max-w-[14ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              {c.name}, answered.
            </h2>
            <p className="mt-6 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              If yours isn&rsquo;t here, it&rsquo;s the first thing we&rsquo;ll
              cover in counselling.
            </p>
          </div>

          <Accordion items={c.faqs} />
        </div>
      </section>
      )}

      {/* ---- 15 · conversion ---- */}
      <Counselling />
      <FinalCta />

      <ScrollReveals />
    </>
  );
}
