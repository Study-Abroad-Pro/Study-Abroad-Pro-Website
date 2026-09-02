import SmoothScroll from "@/components/motion/SmoothScroll";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Preloader from "@/components/ui/Preloader";
import { getSiteContact } from "@/lib/data/settings";

/** The public marketing site — everything except `/admin`. */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { phone } = await getSiteContact();

  return (
    <>
      <Preloader />
      <SmoothScroll />
      <SiteHeader phone={phone} />
      <main>{children}</main>
      <SiteFooter />

      {/* Sticky mobile CTA — the highest-converting element on phone traffic.
          Hidden while the full-screen menu is open (see SiteHeader). */}
      <a
        href="/#counselling"
        className="menu-cta fixed inset-x-4 bottom-4 z-50 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_14px_34px_-12px_rgba(255,50,13,0.85)] lg:hidden"
      >
        <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17.5 14.1v2.1a1.4 1.4 0 0 1-1.5 1.4 13.9 13.9 0 0 1-6-2.2 13.6 13.6 0 0 1-4.2-4.2 13.9 13.9 0 0 1-2.2-6.1A1.4 1.4 0 0 1 5 3.6h2.1a1.4 1.4 0 0 1 1.4 1.2c.1.7.3 1.3.5 1.9a1.4 1.4 0 0 1-.3 1.5l-.9.9a11.2 11.2 0 0 0 4.2 4.2l.9-.9a1.4 1.4 0 0 1 1.5-.3c.6.2 1.2.4 1.9.5a1.4 1.4 0 0 1 1.2 1.5z" />
        </svg>
        Free Counselling
      </a>
    </>
  );
}
