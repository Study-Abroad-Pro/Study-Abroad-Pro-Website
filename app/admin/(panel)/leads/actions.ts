"use server";

import { revalidatePath } from "next/cache";
import { redirectWithToast } from "@/lib/admin/redirect-toast";
import { requireAdmin } from "@/lib/admin/auth";
import { writeAudit } from "@/lib/admin/audit";
import { getServiceSupabase } from "@/lib/supabase/service";
import { LEAD_STATUSES, type LeadStatus } from "@/components/admin/StatusBadge";

export type LeadActionState = { ok: boolean; error?: string };

/** Shared: write a new status (stamping first-contact time), audit, revalidate. */
async function applyStatus(
  id: string,
  status: LeadStatus,
  extra: { notes?: string | null } = {},
) {
  const actor = await requireAdmin();
  const db = getServiceSupabase();

  const { data: before } = await db
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { ok: false as const, error: "Lead not found." };

  const patch: {
    status: LeadStatus;
    contacted_at?: string;
    notes?: string | null;
  } = { status };
  if (status !== "new" && !before.contacted_at) {
    patch.contacted_at = new Date().toISOString();
  }
  if ("notes" in extra) patch.notes = extra.notes ?? null;

  const { data: after, error } = await db
    .from("leads")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { ok: false as const, error: error.message };

  await writeAudit(actor, {
    action: "lead.update",
    entity: "lead",
    entityId: id,
    summary: `${before.full_name}: ${before.status} → ${status}`,
    before,
    after,
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
  return { ok: true as const, name: before.full_name as string };
}

/** Full save from the lead detail page — redirects back to the list. */
export async function updateLead(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  const notes = String(formData.get("notes") ?? "").trim();

  if (!id) return { ok: false, error: "Missing lead id." };
  if (!LEAD_STATUSES.includes(status)) return { ok: false, error: "Unknown status." };

  const res = await applyStatus(id, status, { notes });
  if (!res.ok) return { ok: false, error: res.error };

  redirectWithToast("/admin/leads", `${res.name} updated`);
}

/** Inline status change from the leads list — stays on the list, just refreshes. */
export async function setLeadStatus(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!id || !LEAD_STATUSES.includes(status)) return;
  await applyStatus(id, status);
}

export async function deleteLead(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing lead id." };

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await writeAudit(actor, {
    action: "lead.delete",
    entity: "lead",
    entityId: id,
    summary: `Deleted lead ${before?.full_name ?? id} (${before?.email ?? "?"})`,
    before,
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirectWithToast(
    "/admin/leads",
    `Lead ${before?.full_name ?? ""} deleted`.replace(/\s+/g, " ").trim(),
  );
}
