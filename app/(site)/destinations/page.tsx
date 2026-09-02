import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Button, { Arrow } from "@/components/ui/Button";
import Flag from "@/components/ui/Flag";
import Accordion from "@/components/ui/Accordion";
import ScrollReveals from "@/components/motion/ScrollReveals";
import DestinationJourney from "@/components/sections/DestinationJourney";
import Counselling from "@/components/sections/Counselling";
import FinalCta from "@/components/sections/FinalCta";
import {
  DESTINATION_FACTORS,
  DESTINATION_FAQS,
  UPCOMING_DESTINATIONS,
} from "@/content/site";
import { getDestinationCards } from "@/lib/data/countries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Study Destinations",
  description:
    "Explore study in Canada, the UK, Australia, Germany, Ireland and New Zealand — programmes, strengths and how to choose the country, course and pathway that match your goals.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    type: "website",
    url: "/destinations",
    title: "Study Destinations — Study Abroad Pro",
    description:
      "Six countries, side by side, and a straight answer on which one fits your profile.",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Study Destinations", item: `${siteUrl}/destinations` },
  ],
};

const SUPPORT = [
  "Personalised career counselling",
  "Country selection",
  "Course selection",
  "University admission",
  "SOP & LOR guidance",
  "Scholarship assistance",
  "Education loan assistance",
  "Visa processing support",
  "IELTS / PTE guidance",
  "Accommodation assistance",
  "Airport pickup",
  "Pre-departure briefing",
  "Post-arrival support",
];

/* --- small line icons for the "which country is right for you" factors --- */
function FactorIcon({ k }: { k: string }) {
  const paths: Record<string, ReactNode> = {
    profile: <path d="M12 4 3 8l9 4 9-4-9-4Zm6 6.2V15c0 1.5-2.7 2.7-6 2.7s-6-1.2-6-2.7v-4.8M21 9v4.5" />,
    career: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
      </>
    ),
    budget: (
      <>
        <ellipse cx="12" cy="6.5" rx="7" ry="2.8" />
        <path d="M5 6.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5M5 11.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5" />
      </>
    ),
    course: (
      <>
        <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" />
        <path d="M5 18a2 2 0 0 1 2-2h11" />
      </>
    ),
    lifestyle: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4c2.2 2.3 3.3 5.2 3.3 8s-1.1 5.7-3.3 8c-2.2-2.3-3.3-5.2-3.3-8S9.8 6.3 12 4Z" />
      </>
    ),
    future: (
      <>
        <path d="M12 3c3 1.5 5 4.8 5 9 0 2-.6 3.4-1.4 4.6H8.4C7.6 15.4 7 14 7 12c0-4.2 2-7.5 5-9Z" />
        <circle cx="12" cy="9.5" r="1.6" />
        <path d="M9 18c-1 1-1.4 2.6-1.3 3.2 0.7.1 2-.3 3-1.3M15 18c1 1 1.4 2.6 1.3 3.2-.7.1-2-.3-3-1.3" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[k]}
    </svg>
  );
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

export default async function DestinationsPage() {
  const featured = await getDestinationCards();

  const destinationsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featured.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Study in ${d.name}`,
      url: `${siteUrl}/${d.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationsLd) }}
      />

      {/* ---- 1 · hero ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(54%_62%_at_86%_-12%,rgba(255,50,13,0.1),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <nav aria-label="Breadcrumb" className="label text-ink/40">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-ink/60">Study Destinations</span>
          </nav>

          <p className="label mt-10 text-brand">Study destinations</p>
          <h1 className="mt-4 max-w-[18ch] text-[clamp(2.3rem,5.4vw,4.2rem)] font-extrabold leading-[0.98]">
            Study where your future takes you.
          </h1>
          <div className="mt-7 flex max-w-[56ch] flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
            <p>
              Explore world-class study destinations and find the country, course
              and pathway that match your ambitions.
            </p>
            <p>
              From Canada and the UK to Australia, Germany, Ireland and New
              Zealand, Study Abroad Pro helps you make the right destination
              choice with personalised guidance at every step.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#featured">Explore Destinations</Button>
            <Button href="#counselling" variant="outline">
              Book Free Counselling
            </Button>
          </div>
          <p className="mt-6 text-[0.875rem] text-muted">
            Choose your destination. Choose your course. Build your future.
          </p>
        </div>
      </section>

      {/* ---- 2 · introduction ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Your dream destination is out there
            </p>
            <h2
              className="mt-4 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              A country is only part of the decision.
            </h2>
            <div className="mt-6 flex max-w-[52ch] flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              <p data-reveal>
                Choosing a study destination means finding the right combination
                of education, course options, career opportunities, lifestyle and
                affordability for your future.
              </p>
              <p data-reveal>
                We help you understand your options and make an informed decision
                based on your academic profile, career goals and preferences.
              </p>
            </div>
          </div>

          <div className="lg:pt-4" data-reveal>
            <p className="label text-ink/50">Explore our top study destinations</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {featured.map((d) => (
                <li key={d.code}>
                  <Link
                    href={`/${d.slug}`}
                    className="inline-flex items-center gap-2.5 rounded-full bg-paper py-2 pl-2 pr-4 text-[0.9375rem] font-medium text-ink-soft ring-1 ring-ink/8 transition-colors hover:text-brand hover:ring-brand/40"
                  >
                    <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full ring-2 ring-white">
                      <Flag code={d.code} src={d.flagUrl} className="h-7 w-7 rounded-full" title={d.name} />
                    </span>
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- 3–8 · featured destinations ---- */}
      <section id="featured" className="relative z-20 scroll-mt-24 bg-white pb-24 sm:pb-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Featured destinations
          </p>
          <h2
            className="mt-4 max-w-[22ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Six countries we know in detail.
          </h2>

          <div className="mt-16 divide-y divide-line">
            {featured.map((d) => {
              // "the UK" reads right in a sentence; every other name stands alone.
              const inName = d.code === "gb" ? "the UK" : d.name;
              return (
              <article
                key={d.code}
                id={d.slug}
                className="scroll-mt-24 py-14 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4" data-reveal>
                  <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full shadow-[0_6px_18px_-6px_rgba(23,23,23,0.45)] ring-2 ring-white sm:h-16 sm:w-16">
                    <Flag code={d.code} src={d.flagUrl} className="h-14 w-14 rounded-full sm:h-16 sm:w-16" title={d.name} />
                  </span>
                  <div>
                    <p className="label text-ink/45">{d.name}</p>
                    <h3 className="mt-1 font-display text-[clamp(1.5rem,3.4vw,2.25rem)] font-extrabold leading-[1.05]">
                      Study in {inName}
                    </h3>
                  </div>
                </div>

                <p
                  className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-soft"
                  data-reveal
                >
                  {d.intro}
                </p>

                <div className="mt-9 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                  <div data-reveal>
                    <p className="label text-ink/50">Programmes available</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {d.programmes.map((p) => (
                        <li
                          key={p}
                          className="rounded-full bg-paper px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink-soft ring-1 ring-ink/8"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div data-reveal>
                    <p className="label text-ink/50">Why explore {inName}?</p>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {d.whyBullets.map((reason) => (
                        <li
                          key={reason}
                          className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft"
                        >
                          <Check />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-9" data-reveal>
                  <Link
                    href={`/${d.slug}`}
                    className="group inline-flex items-center gap-2 font-display text-[0.9375rem] font-semibold text-brand underline-offset-4 hover:underline"
                  >
                    Explore Study in {inName}
                    <Arrow />
                  </Link>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- 9 · which country is right for you ---- */}
      <section className="relative z-20 bg-cream py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Find your best destination
          </p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2
              className="max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              Which country is right for you?
            </h2>
            <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              There is no single best study destination for every student. The
              right choice comes down to six things.
            </p>
          </div>

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATION_FACTORS.map((f) => (
              <li key={f.key} className="border-t border-ink/12 pt-6" data-reveal>
                <span className="grid h-11 w-11 place-items-center rounded-full text-brand ring-1 ring-brand/35">
                  <FactorIcon k={f.key} />
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug">{f.title}</h3>
                <p className="mt-2 max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-14" data-reveal>
            <Button href="#counselling">Find the right destination for me</Button>
          </div>
        </div>
      </section>

      {/* ---- 10 · comparison ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Compare your study options
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            The six, side by side.
          </h2>

          <div className="mt-12 overflow-x-auto" data-reveal>
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink/15">
                  <th className="label pb-4 pr-6 text-ink/50">Destination</th>
                  <th className="label pb-4 pr-6 text-ink/50">Popular study areas</th>
                  <th className="label pb-4 text-ink/50">Study levels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {featured.map((d) => (
                  <tr key={d.code}>
                    <td className="py-5 pr-6">
                      <span className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-white">
                          <Flag code={d.code} src={d.flagUrl} className="h-8 w-8 rounded-full" title={d.name} />
                        </span>
                        <span className="font-display text-[0.9375rem] font-bold">{d.name}</span>
                      </span>
                    </td>
                    <td className="py-5 pr-6 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {d.studyAreas}
                    </td>
                    <td className="py-5 text-[0.9375rem] text-ink-soft">{d.levels}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-[70ch] text-[0.875rem] leading-relaxed text-muted" data-reveal>
            Course availability, admission requirements, tuition fees, visa
            conditions and post-study options vary by institution, programme and
            student profile. Get current guidance before making a final decision.
          </p>
        </div>
      </section>

      {/* ---- 11 · the journey ---- */}
      <DestinationJourney />

      {/* ---- 12 · why choose us ---- */}
      <section className="relative z-20 bg-paper py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Why choose Study Abroad Pro
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              The right destination starts with the right guidance.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              You don&rsquo;t have to navigate the study-abroad process alone. One
              team carries it from the first conversation to your first week
              abroad.
            </p>
            <div className="mt-8" data-reveal>
              <Button href="#counselling">Talk to a study abroad expert</Button>
            </div>
          </div>

          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2" data-reveal>
            {SUPPORT.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-ink-soft">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- 13 · coming soon ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            Additional destinations
          </p>
          <h2
            className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            More destinations coming soon.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            We&rsquo;re building the university relationships to support these
            properly before we add them.
          </p>

          <ul className="mt-9 flex flex-wrap gap-3" data-reveal>
            {UPCOMING_DESTINATIONS.map((name) => (
              <li
                key={name}
                className="rounded-full bg-paper px-4 py-2.5 text-[0.9375rem] font-medium text-ink-soft ring-1 ring-ink/8"
              >
                {name}
              </li>
            ))}
          </ul>

          <div className="mt-10" data-reveal>
            <Button href="#counselling" variant="outline">
              Register your interest
            </Button>
          </div>
        </div>
      </section>

      {/* ---- 14 · faq ---- */}
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
              Frequently asked questions.
            </h2>
            <p className="mt-6 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              If yours isn&rsquo;t here, ask it in the counselling session.
            </p>
          </div>

          <Accordion items={DESTINATION_FAQS} />
        </div>
      </section>

      {/* ---- 15 · conversion ---- */}
      <Counselling />
      <FinalCta />

      <ScrollReveals />
    </>
  );
}
