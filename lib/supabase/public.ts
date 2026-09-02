import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Anonymous read client for public pages.
 *
 * Reads run on the server during static generation / revalidation, never in
 * the browser: a thousand visitors to a country page cost one database read
 * rather than a thousand. RLS still applies — this key only ever sees
 * published rows.
 *
 * `cache()` dedupes identical queries within a single render pass.
 */
export const getPublicSupabase = cache((): SupabaseClient<Database> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return createClient<Database>(url, anon, { auth: { persistSession: false } });
});

export function storageUrl(bucket: string, key: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${key}`;
}
