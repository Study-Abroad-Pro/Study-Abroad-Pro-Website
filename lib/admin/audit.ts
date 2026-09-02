import { getServiceSupabase } from "@/lib/supabase/service";
import type { AdminSession } from "./auth";

/**
 * Append a row to `admin_audit`. Every mutation the panel performs calls this.
 * Failures are logged but never block the mutation they describe.
 */
export async function writeAudit(
  actor: AdminSession,
  entry: {
    action: string;
    entity: string;
    entityId?: string | null;
    summary: string;
    before?: unknown;
    after?: unknown;
  },
): Promise<void> {
  try {
    await getServiceSupabase()
      .from("admin_audit")
      .insert({
        actor: actor.userId,
        actor_email: actor.email,
        action: entry.action,
        entity: entry.entity,
        entity_id: entry.entityId ?? null,
        summary: entry.summary,
        before: (entry.before ?? null) as never,
        after: (entry.after ?? null) as never,
      });
  } catch (err) {
    console.error("[audit] write failed", err);
  }
}
