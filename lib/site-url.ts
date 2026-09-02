/**
 * The site's public origin, e.g. `https://studyabroadpro.com`.
 *
 * Read from `NEXT_PUBLIC_SITE_URL`, but tolerant of it being missing, blank, or
 * not a valid URL — which is the normal state of a brand-new Vercel project
 * before the domain is wired up. `??` alone is not enough here: an env var set
 * to an empty string passes `??` and then crashes `new URL("")` during the
 * build ("Failed to collect page data for /_not-found").
 */
export const SITE_URL: string = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      // fall through to the default
    }
  }
  return "http://localhost:3000";
})();
