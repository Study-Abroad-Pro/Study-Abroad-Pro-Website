import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Study Abroad Pro — Your Global Education Journey Starts Here",
    template: "%s | Study Abroad Pro",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Study Abroad Pro — Your Global Education Journey Starts Here",
    description: SITE.description,
    images: [{ url: "/og-home.webp", width: 1600, height: 900 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ff320d",
  colorScheme: "light",
};

/**
 * Root layout owns only <html>/<body> and the fonts. The public site's chrome
 * lives in `app/(site)/layout.tsx`; the admin area brings its own in
 * `app/admin/(panel)/layout.tsx`. Keeping the split at the route-group level
 * (rather than a runtime `usePathname` check) means each area's server render
 * is correct with no hydration guesswork.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
