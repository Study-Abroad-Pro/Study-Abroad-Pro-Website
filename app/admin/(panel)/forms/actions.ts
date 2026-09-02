"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirectWithToast } from "@/lib/admin/redirect-toast";
import { requireAdmin } from "@/lib/admin/auth";
import { writeAudit } from "@/lib/admin/audit";
import { getServiceSupabase } from "@/lib/supabase/service";
import { mergeFormsConfig } from "@/lib/forms/config";
import { formsFromFormData } from "@/lib/forms/parse";

export type FormsActionState = { ok: boolean; error?: string };

export async function updateForms(
  _prev: FormsActionState,
  formData: FormData,
): Promise<FormsActionState> {
  const actor = await requireAdmin();

  const forms = formsFromFormData(formData);

  const notifyEmail = (forms.notify as { email?: string } | undefined)?.email ?? "";
  if (notifyEmail) {
    const parts = notifyEmail.split(/[,;\s]+/).filter(Boolean);
    const bad = parts.find((p) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p));
    if (bad) return { ok: false, error: `“${bad}” is not a valid email address.` };
  }

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  const { data: after, error } = await db
    .from("site_settings")
    .upsert({ id: true, forms: forms as never })
    .select("*")
    .single();

  if (error) return { ok: false, error: error.message };

  await writeAudit(actor, {
    action: "forms.update",
    entity: "site_settings",
    entityId: "singleton",
    summary: "Updated form settings",
    before: before?.forms ?? null,
    after: after.forms,
  });

  // Stored shape is re-validated on read, but normalise now so a bad payload
  // can't slip through unnoticed.
  mergeFormsConfig(forms);

  revalidateTag("site-settings");
  revalidatePath("/admin/forms");
  revalidatePath("/", "layout");
  redirectWithToast("/admin/forms", "Form settings saved — the site updates shortly");
}
