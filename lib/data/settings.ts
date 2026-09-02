import { unstable_cache } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import { SITE } from "@/content/site";

/**
 * Editable site settings — the contact block shown across the site and the
 * homepage copy. Backed by the `site_settings` singleton row, edited in
 * `/admin/settings`. Values fall back to the placeholders in `content/site.ts`
 * when a field is blank.
 *
 * Cached with the `site-settings` tag; the settings action revalidates it.
 */

export type SiteContact = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
};

export type HomepageCopy = {
  tagline: string;
  description: string;
};

const FALLBACK_CONTACT: SiteContact = {
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  address: SITE.address,
};

export const getSiteContact = unstable_cache(
  async (): Promise<SiteContact> => {
    const { data } = await getPublicSupabase()
      .from("site_settings")
      .select("contact")
      .eq("id", true)
      .maybeSingle();

    const c = (data?.contact ?? {}) as Partial<SiteContact>;
    return {
      phone: c.phone?.trim() || FALLBACK_CONTACT.phone,
      whatsapp: c.whatsapp?.trim() || FALLBACK_CONTACT.whatsapp,
      email: c.email?.trim() || FALLBACK_CONTACT.email,
      address: c.address?.trim() || FALLBACK_CONTACT.address,
    };
  },
  ["site-contact"],
  { tags: ["site-settings"] },
);

export const getHomepageCopy = unstable_cache(
  async (): Promise<HomepageCopy> => {
    const { data } = await getPublicSupabase()
      .from("site_settings")
      .select("homepage")
      .eq("id", true)
      .maybeSingle();

    const h = (data?.homepage ?? {}) as Partial<HomepageCopy>;
    return {
      tagline: h.tagline?.trim() || SITE.tagline,
      description: h.description?.trim() || SITE.description,
    };
  },
  ["homepage-copy"],
  { tags: ["site-settings"] },
);
