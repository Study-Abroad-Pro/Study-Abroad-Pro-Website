import { NextResponse } from "next/server";
import { getPublicSupabase } from "@/lib/supabase/public";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Keep-alive. Supabase pauses a free project after seven days of inactivity,
 * which would take the next rebuild down with it. A Vercel Cron entry hits
 * this every three days; the query returns a single id, so the egress cost is
 * a few bytes per call. The schedule lives in vercel.json.
 */
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, supabase: "not configured" });
  }
  try {
    const { error } = await getPublicSupabase().from("countries").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    console.error("[health] supabase unreachable", err);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
