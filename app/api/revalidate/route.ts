import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * On-demand revalidation, called by a Supabase Database Webhook on insert or
 * update. This is what lets content pages sit on a 24-hour ISR window — long
 * enough that traffic costs almost no database reads — while an edit still
 * goes live within seconds.
 *
 * Supabase → Database → Webhooks → HTTP Request
 *   URL:     https://yourdomain.com/api/revalidate
 *   Headers: x-revalidate-secret: <REVALIDATE_SECRET>
 *   Body:    { "tag": "countries" }
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let tag = "content";
  try {
    const body = (await request.json()) as { tag?: string; table?: string };
    tag = body.tag ?? body.table ?? "content";
  } catch {
    // An empty body is fine — fall back to the catch-all tag.
  }

  revalidateTag(tag);
  return NextResponse.json({ ok: true, tag, at: new Date().toISOString() });
}
