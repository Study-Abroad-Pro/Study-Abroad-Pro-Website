import { unstable_cache } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import { mergeFormsConfig, type FormsConfig } from "@/lib/forms/config";

/**
 * Read model for the public lead-capture forms.
 *
 *  - `getFormsConfig()` — the editable copy / option lists / field toggles,
 *    backed by `site_settings.forms` and revalidated by the `site-settings`
 *    tag (the `/admin/forms` action calls `revalidateTag("site-settings")`).
 *  - `getPreferredCountryOptions()` — the "Preferred country" dropdown values,
 *    derived from the published `countries` table so a country added in
 *    `/admin/countries` appears in every form automatically. Revalidated by
 *    the `countries` tag.
 */

export const getFormsConfig = unstable_cache(
  async (): Promise<FormsConfig> => {
    const { data } = await getPublicSupabase()
      .from("site_settings")
      .select("forms")
      .eq("id", true)
      .maybeSingle();
    return mergeFormsConfig(data?.forms);
  },
  ["forms-config"],
  { tags: ["site-settings"] },
);

export const getPreferredCountryOptions = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await getPublicSupabase()
      .from("countries")
      .select("name")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    const names = (data ?? [])
      .map((r) => (r.name ?? "").trim())
      .filter(Boolean);
    return [...new Set(names)];
  },
  ["preferred-country-options"],
  { tags: ["countries"] },
);
