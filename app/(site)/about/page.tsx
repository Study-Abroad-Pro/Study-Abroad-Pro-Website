import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Flag from "@/components/ui/Flag";
import ScrollReveals from "@/components/motion/ScrollReveals";
import Counselling from "@/components/sections/Counselling";
import FinalCta from "@/components/sections/FinalCta";
import {
  ABOUT,
  STEPS,
  TEAM,
  TEAM_ARE_PLACEHOLDERS,
} from "@/content/site";
import { getSiteContact } from "@/lib/data/settings";
import { getDestinationCards } from "@/lib/data/countries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Study Abroad Pro helps students choose a country, course and university with real information behind every decision — and stays with them from the first counselling session to the week after they land.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About Study Abroad Pro",
    description:
      "Who we are, how we work, and the principles behind every recommendation we make.",
  },
};

// BreadcrumbList is the JSON-LD every nested route carries (see the build plan's
// SEO map). Home-level EducationalOrganization markup stays on the home page.
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "About Us", item: `${siteUrl}/about` },
  ],
};

export default async function AboutPage() {
  const [{ phone }, destinations] = await Promise.all([
    getSiteContact(),
    getDestinationCards(),
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ---- page header ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_60%_at_88%_-10%,rgba(255,50,13,0.09),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <nav aria-label="Breadcrumb" className="label text-ink/40">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-ink/60">About</span>
          </nav>

          <p className="label mt-10 text-brand">{ABOUT.eyebrow}</p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(2.4rem,5.6vw,4.4rem)] font-extrabold leading-[0.98]">
            {ABOUT.title}
          </h1>
          <p className="mt-7 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
            {ABOUT.standfirst}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#counselling">Book Free Counselling</Button>
            <Button href="/contact" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* ---- story ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Our story
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              A decision you can explain to yourself in five years.
            </h2>
          </div>

          <div className="flex flex-col gap-10">
            {ABOUT.story.map((block) => (
              <div key={block.h} data-reveal>
                <h3 className="font-display text-xl font-bold">{block.h}</h3>
                <div className="mt-3 flex flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-soft">
                  {block.p.map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the numbers: the one dark band ---- */}
      <section className="relative z-20 overflow-hidden bg-ink py-20 text-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_50%_at_20%_15%,rgba(255,50,13,0.16),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            In practice
          </p>
          <dl className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT.facts.map((fact) => (
              <div key={fact.label} className="border-t border-white/15 pt-5" data-reveal>
                <dt className="font-display text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-none tracking-tight">
                  {fact.value}
                </dt>
                <dd className="mt-2.5 max-w-[22ch] text-[0.9375rem] leading-relaxed text-cream/65">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- principles ---- */}
      <section className="relative z-20 bg-cream py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand" data-reveal>
            What we believe
          </p>
          <h2
            className="mt-4 max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            Four things that decide how we advise you.
          </h2>

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {ABOUT.principles.map((p, i) => (
              <li key={p.title} className="border-t border-ink/12 pt-6" data-reveal>
                <span className="label text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl font-bold leading-snug">{p.title}</h3>
                <p className="mt-2.5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- where we work ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] gap-14 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Where we work
            </p>
            <h2
              className="mt-4 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              Six systems we know in detail.
            </h2>
            <p
              className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft"
              data-reveal
            >
              Each of these is a country we can talk through properly — entry
              routes, costs, work rights and the visa process — because we work
              in it every week, not because it is on a list.
            </p>
            <div className="mt-8" data-reveal>
              <Button href="/destinations" variant="outline">
                Explore Destinations
              </Button>
            </div>
          </div>

          <div data-reveal>
            <ul className="divide-y divide-line rounded-2xl bg-paper p-7 ring-1 ring-ink/8 sm:p-9">
              {destinations.map((d) => (
                <li
                  key={d.code}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full shadow-[0_3px_10px_-5px_rgba(23,23,23,0.5)] ring-2 ring-white">
                    <Flag code={d.code} src={d.flagUrl} className="h-8 w-8 rounded-full" title={d.name} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/${d.slug}`}
                      className="block font-display text-[0.9375rem] font-bold hover:text-brand"
                    >
                      {d.name}
                    </Link>
                    <span className="block truncate text-[0.8125rem] text-muted">
                      {d.programmes.slice(0, 3).join(" · ")}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[48ch] text-[0.875rem] leading-relaxed text-muted">
              France, Sweden, the Netherlands, the UAE and Singapore are being
              added as we build the university relationships to support them
              properly.
            </p>
          </div>
        </div>
      </section>

      {/* ---- how we guide you (the process) ---- */}
      <section className="relative z-20 bg-paper py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label text-brand" data-reveal>
                How we guide you
              </p>
              <h2
                className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
                data-reveal
              >
                Six steps, and you always know which one you are on.
              </h2>
            </div>
            <p
              className="max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink-soft"
              data-reveal
            >
              The same process for every student, from the first conversation to
              your first week abroad.
            </p>
          </div>

          <ol className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-line pt-6" data-reveal>
                <span className="label tabular-nums text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- team ---- */}
      <section className="relative z-20 bg-cream py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label text-brand" data-reveal>
                Our team
              </p>
              <h2
                className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
                data-reveal
              >
                Who handles what.
              </h2>
            </div>
            {TEAM_ARE_PLACEHOLDERS ? (
              <p
                className="max-w-[44ch] rounded-xl bg-white/70 px-5 py-4 text-[0.9375rem] leading-relaxed text-ink-soft ring-1 ring-brand/30"
                data-reveal
              >
                <strong className="font-semibold">Roles, not names yet.</strong>{" "}
                Individual counsellor profiles and photos go here once they are
                confirmed — nothing on this page is invented to fill the space.
              </p>
            ) : null}
          </div>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <li
                key={member.role}
                className="relative flex flex-col gap-3 rounded-2xl bg-white p-7 ring-1 ring-ink/8"
                data-reveal
              >
                {TEAM_ARE_PLACEHOLDERS ? (
                  <span className="absolute right-5 top-5 rounded-full bg-brand-tint px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-deep">
                    Role
                  </span>
                ) : null}
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-full font-display text-[0.9375rem] font-extrabold text-brand ring-1 ring-brand/35"
                >
                  {member.role
                    .split(/[\s&]+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug">
                  {member.role}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted">{member.focus}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[0.9375rem] text-muted" data-reveal>
            Every student works with a lead counsellor as their single point of
            contact — the specialists above are brought in as each stage comes
            up.{" "}
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              {phone}
            </a>
          </p>
        </div>
      </section>

      {/* ---- conversion ---- */}
      <Counselling />
      <FinalCta />

      <ScrollReveals />
    </>
  );
}
