import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SITE } from "@/content/site";
import { getSiteContact } from "@/lib/data/settings";
import { getDestinationCards } from "@/lib/data/countries";

const STATIC_COLUMNS = [
  {
    title: "Courses",
    links: [
      { label: "Nursing", href: "/courses/nursing" },
      { label: "Engineering", href: "/courses/engineering" },
      { label: "Information Technology", href: "/courses/it" },
      { label: "Artificial Intelligence", href: "/courses/ai" },
      { label: "MBA", href: "/courses/mba" },
      { label: "Healthcare", href: "/courses/healthcare" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "University Admission", href: "/services#admission" },
      { label: "Career Counselling", href: "/services#counselling" },
      { label: "Visa Processing", href: "/services#visa" },
      { label: "Scholarships", href: "/services#scholarships" },
      { label: "IELTS / PTE", href: "/services#english" },
      { label: "Accommodation", href: "/services#accommodation" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
];

export default async function SiteFooter() {
  const [{ phone, email }, destinations] = await Promise.all([
    getSiteContact(),
    getDestinationCards(),
  ]);

  const COLUMNS = [
    {
      title: "Destinations",
      links: destinations.map((d) => ({ label: d.name, href: `/${d.slug}` })),
    },
    ...STATIC_COLUMNS,
  ];

  return (
    <footer className="relative z-20 bg-ink text-cream">
      <div className="mx-auto w-full max-w-[86rem] px-6 py-20 sm:px-10">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.02]">
            Ready to start your journey?
          </h2>
          <Button href="/#counselling">Book Free Counselling</Button>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:pr-6">
            <Image
              src="/brand/logo-cream.webp"
              alt={SITE.name}
              width={720}
              height={322}
              className="h-12 w-auto"
            />
            <p className="max-w-[30ch] text-sm leading-relaxed text-cream/65">
              Your trusted partner for studying abroad.
            </p>
            <div className="flex flex-col gap-1 text-sm text-cream/75">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-brand">
                {phone}
              </a>
              <a href={`mailto:${email}`} className="hover:text-brand">
                {email}
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3.5">
              <h3 className="label text-cream/45">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-cream/80 transition-colors hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-8 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Expert Guidance · University Admissions · Visa Support · Pre &amp; Post Arrival Assistance</p>
        </div>
      </div>
    </footer>
  );
}
