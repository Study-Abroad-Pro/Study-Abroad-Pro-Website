import { NextResponse, after } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { getServiceSupabase } from "@/lib/supabase/service";
import { notifyNewLead } from "@/lib/leads/notify";
import type { TablesInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The only path in the whole site that writes to Supabase.
 *
 * Everything else is statically generated, so this handler is also the only
 * place where visitor traffic can turn into database requests. It validates,
 * screens obvious bots and rate-limits before a row is ever inserted.
 */

// Per-instance memory. Enough to stop a script hammering one serverless
// instance; swap for Upstash or a Postgres counter if abuse becomes real.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { company, elapsed_ms, ...lead } = parsed.data;

  // Honeypot filled, or the form was completed faster than a human could type.
  if (company || (typeof elapsed_ms === "number" && elapsed_ms < 2500)) {
    return NextResponse.json({ ok: true });
  }

  // Development convenience: with no Supabase keys configured, log the lead
  // and succeed so the form can be exercised locally. Guarded on NODE_ENV, so
  // a production deploy missing its keys still fails loudly rather than
  // silently dropping real enquiries.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[leads] no SUPABASE_SERVICE_ROLE_KEY — logging instead:", lead);
      return NextResponse.json({ ok: true, stored: false });
    }
    console.error("[leads] SUPABASE_SERVICE_ROLE_KEY missing in production");
    return NextResponse.json(
      { ok: false, error: "We could not save your details. Please call us instead." },
      { status: 500 },
    );
  }

  let leadId: string | null = null;
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("leads")
      .insert(lead as TablesInsert<"leads">)
      .select("id")
      .single();
    if (error) throw error;
    leadId = data?.id ?? null;
  } catch (err) {
    console.error("[leads] insert failed", err);
    return NextResponse.json(
      { ok: false, error: "We could not save your details. Please call us instead." },
      { status: 500 },
    );
  }

  // Email the counsellor, if a recipient is configured in /admin/forms. Runs
  // after the response so a slow mail API never holds up the visitor.
  after(() => notifyNewLead(lead, leadId));

  return NextResponse.json({ ok: true });
}
