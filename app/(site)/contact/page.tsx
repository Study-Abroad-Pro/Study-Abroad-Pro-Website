import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "@/components/ui/Button";
import ContactForm from "@/components/forms/ContactForm";
import FinalCta from "@/components/sections/FinalCta";
import ScrollReveals from "@/components/motion/ScrollReveals";
import { SITE } from "@/content/site";
import { getSiteContact, type SiteContact } from "@/lib/data/settings";
import { getFormsConfig, getPreferredCountryOptions } from "@/lib/data/forms";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, WhatsApp, email or message Study Abroad Pro. We reply to every message within one working day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact Study Abroad Pro",
    description: "The fastest ways to reach a counsellor.",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
  ],
};

function buildMethods(contact: SiteContact) {
  const methods: {
    key: string;
    label: string;
    value: string;
    href: string;
    external?: boolean;
    best: string;
    icon: ReactNode;
  }[] = [
    {
      key: "call",
      label: "Call us",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      best: "Best for anything urgent or time-sensitive.",
      icon: (
        <path d="M17.5 14.1v2.1a1.4 1.4 0 0 1-1.5 1.4 13.9 13.9 0 0 1-6-2.2 13.6 13.6 0 0 1-4.2-4.2 13.9 13.9 0 0 1-2.2-6.1A1.4 1.4 0 0 1 5 3.6h2.1a1.4 1.4 0 0 1 1.4 1.2c.1.7.3 1.3.5 1.9a1.4 1.4 0 0 1-.3 1.5l-.9.9a11.2 11.2 0 0 0 4.2 4.2l.9-.9a1.4 1.4 0 0 1 1.5-.3c.6.2 1.2.4 1.9.5a1.4 1.4 0 0 1 1.2 1.5z" />
      ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
      external: true,
      best: "Best for quick questions and sending documents.",
      icon: (
        <>
          <path d="M3.5 18.5 2.5 22l3.6-1a8.5 8.5 0 1 0-3.1-3z" />
          <path d="M8 8.5c0 4 2.5 6.5 6.5 6.5 .6 0 1.1-.5 1.1-1.1v-.9a.7.7 0 0 0-.5-.7l-1.6-.5a.7.7 0 0 0-.7.2l-.4.5a5.6 5.6 0 0 1-2.2-2.2l.5-.4a.7.7 0 0 0 .2-.7L9.6 6.4a.7.7 0 0 0-.7-.5H8c-.6 0-1.1.5-1.1 1.1" />
        </>
      ),
    },
    {
      key: "email",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      best: "Best for detailed enquiries with attachments.",
      icon: (
        <>
          <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
          <path d="m3.5 6.5 6.5 4.3L16.5 6.5" />
        </>
      ),
    },
    {
      key: "visit",
      label: "Visit",
      value: contact.address,
      href: "#location",
      best: "Book ahead so a counsellor is free when you arrive.",
      icon: (
        <>
          <path d="M10 18.5S3.5 13 3.5 8a6.5 6.5 0 0 1 13 0c0 5-6.5 10.5-6.5 10.5z" />
          <circle cx="10" cy="8" r="2.4" />
        </>
      ),
    },
  ];
  return methods;
}

const NEXT_STEPS = [
  "We read your message and route it to the right counsellor.",
  "You get a reply within one working day, with a time to talk.",
  "The first session maps your profile against what's realistic.",
];

function MethodIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default async function ContactPage() {
  const [contact, formsConfig, countryOptions] = await Promise.all([
    getSiteContact(),
    getFormsConfig(),
    getPreferredCountryOptions(),
  ]);
  const methods = buildMethods(contact);
  const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${contact.email}`;
  const waHref = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: siteUrl,
    email: contact.email,
    telephone: contact.phone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: contact.phone,
      email: contact.email,
      availableLanguage: ["English"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />

      {/* ---- hero ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-14 pt-32 sm:pb-20 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_82%_-8%,rgba(255,50,13,0.11),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <nav aria-label="Breadcrumb" className="label text-ink/40">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-ink/60">Contact</span>
          </nav>

          <p className="label mt-10 text-brand">Contact</p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(2.4rem,5.6vw,4.4rem)] font-extrabold leading-[0.98]">
            Talk to someone who has done this before.
          </h1>
          <p className="mt-7 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
            Call, message or send an email — whichever suits you. A counsellor
            reads every enquiry, and we reply within one working day.
          </p>
        </div>
      </section>

      {/* ---- contact methods ---- */}
      <section className="relative z-20 bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {methods.map((m) => (
              <li key={m.key} data-reveal>
                <a
                  href={m.href}
                  {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="lift group flex h-full flex-col gap-4 rounded-2xl bg-paper p-6 ring-1 ring-ink/8 hover:ring-brand/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-brand ring-1 ring-brand/30 transition-colors group-hover:bg-brand group-hover:text-white">
                    <MethodIcon>{m.icon}</MethodIcon>
                  </span>
                  <span>
                    <span className="label block text-ink/45">{m.label}</span>
                    <span className="mt-1.5 block break-words font-display text-[1.0625rem] font-bold leading-snug">
                      {m.value}
                    </span>
                  </span>
                  <span className="mt-auto text-[0.8125rem] leading-relaxed text-muted">
                    {m.best}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- form ---- */}
      <section className="relative z-20 bg-cream py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] items-start gap-12 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Send a message
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              Tell us where you are in the process.
            </h2>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
              A line about your qualification, the countries or courses you are
              weighing, and what you would like to talk through is enough for us
              to point you in the right direction.
            </p>

            <ol className="mt-9 flex flex-col gap-4" data-reveal>
              {NEXT_STEPS.map((step, i) => (
                <li key={step} className="flex items-start gap-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-[0.75rem] font-extrabold text-brand ring-1 ring-brand/35">
                    {i + 1}
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-9 text-[0.9375rem] text-muted" data-reveal>
              Ready to book directly?{" "}
              <Link
                href="/#counselling"
                className="font-semibold text-brand underline-offset-4 hover:underline"
              >
                Request free counselling
              </Link>
              .
            </p>
          </div>

          <div data-reveal>
            <ContactForm
              countryOptions={countryOptions}
              showCountry={formsConfig.contact.showCountry}
              copy={{
                submitLabel: formsConfig.contact.submitLabel,
                reassurance: formsConfig.contact.reassurance,
                successHeading: formsConfig.contact.successHeading,
                successBody: formsConfig.contact.successBody,
              }}
            />
          </div>
        </div>
      </section>

      {/* ---- location & hours ---- */}
      <section id="location" className="relative z-20 scroll-mt-24 bg-white py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[86rem] items-center gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="label text-brand" data-reveal>
              Where to find us
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
              data-reveal
            >
              Come in for a session.
            </h2>

            <dl className="mt-9 flex flex-col gap-6" data-reveal>
              <div>
                <dt className="label text-ink/45">Office</dt>
                <dd className="mt-1.5 max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                  {contact.address}
                </dd>
              </div>
              <div>
                <dt className="label text-ink/45">Counselling hours</dt>
                <dd className="mt-1.5 text-[1.0625rem] leading-relaxed text-ink-soft">
                  Monday to Saturday, by appointment. Message us any time — we
                  reply within one working day.
                </dd>
              </div>
              <div>
                <dt className="label text-ink/45">Direct lines</dt>
                <dd className="mt-1.5 flex flex-col gap-1 text-[1.0625rem] text-ink-soft">
                  <a href={telHref} className="font-semibold hover:text-brand">
                    {contact.phone}
                  </a>
                  <a href={mailHref} className="font-semibold hover:text-brand">
                    {contact.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-9" data-reveal>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-display text-[0.9375rem] font-semibold text-brand underline-offset-4 hover:underline"
              >
                Message us on WhatsApp
                <Arrow />
              </a>
            </div>
          </div>

          {/* stylised location panel — a real map goes in once the address is set */}
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink ring-1 ring-ink/10"
            data-reveal
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,236,216,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,236,216,0.6) 1px, transparent 1px)",
                backgroundSize: "34px 34px",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_45%,rgba(255,50,13,0.28),transparent_70%)]" />
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
              <span className="relative grid h-14 w-14 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white shadow-[0_10px_30px_-8px_rgba(255,50,13,0.8)]">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 18.5S3.5 13 3.5 8a6.5 6.5 0 0 1 13 0c0 5-6.5 10.5-6.5 10.5z" />
                    <circle cx="10" cy="8" r="2.4" />
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />

      <ScrollReveals />
    </>
  );
}
