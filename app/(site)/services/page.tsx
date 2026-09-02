import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ScrollReveals from "@/components/motion/ScrollReveals";
import ServicesTimeline from "@/components/sections/ServicesTimeline";
import Counselling from "@/components/sections/Counselling";
import FinalCta from "@/components/sections/FinalCta";
import { SERVICES } from "@/content/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Twelve services that carry a student from the first counselling session to the week after they land abroad — course selection, admissions, SOPs, scholarships, loans, visas, English tests, accommodation and post-arrival support.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    title: "What Study Abroad Pro does",
    description:
      "Every step of the study-abroad journey, and what each one actually involves.",
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
  ],
};

// Mirrors the on-page list so the services show up as structured data.
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.title,
    description: s.body,
    url: `${siteUrl}/services#${s.anchor}`,
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />

      {/* ---- page header ---- */}
      <section className="relative z-20 overflow-hidden bg-paper pb-14 pt-32 sm:pb-20 sm:pt-40">
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
            <span className="text-ink/60">Services</span>
          </nav>

          <p className="label mt-10 text-brand">Our services</p>
          <h1 className="mt-4 max-w-[20ch] text-[clamp(2.3rem,5.4vw,4.2rem)] font-extrabold leading-[0.98]">
            Everything the journey needs, in order.
          </h1>
          <p className="mt-7 max-w-[54ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
            Twelve services, from the first conversation about where to study to
            the week after you land. Most of them matter long before a student
            thinks to ask about them — which is the point of having someone whose
            job is to know.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#counselling">Book Free Counselling</Button>
            <Button href="/about" variant="outline">
              About Study Abroad Pro
            </Button>
          </div>
        </div>
      </section>

      {/* ---- the timeline ---- */}
      <section className="relative z-20 bg-white py-24 sm:py-28">
        <div className="mx-auto w-full max-w-[70rem] px-6 sm:px-10">
          <ServicesTimeline />
        </div>
      </section>

      {/* ---- conversion ---- */}
      <Counselling />
      <FinalCta />

      <ScrollReveals />
    </>
  );
}
