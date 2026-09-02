import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Service-role client. Bypasses RLS entirely — server-only, never imported
 * into a client component. Used by the lead route and by verified admin
 * actions after the caller's role has been checked in application code.
 */
export function getServiceSupabase(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Public URL for a Storage key. Columns store keys such as
 * `blog/canada-guide.avif`, not full URLs, so changing bucket or CDN later is
 * a one-line change rather than a data migration.
 */
export function storageUrl(bucket: string, key: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${key}`;
}
