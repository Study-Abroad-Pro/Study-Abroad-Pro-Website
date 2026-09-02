"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirectWithToast } from "@/lib/admin/redirect-toast";
import { requireAdmin } from "@/lib/admin/auth";
import { writeAudit } from "@/lib/admin/audit";
import { getServiceSupabase } from "@/lib/supabase/service";

export type SettingsActionState = { ok: boolean; error?: string };

export async function updateSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const actor = await requireAdmin();
  const str = (k: string) => String(formData.get(k) ?? "").trim();

  const email = str("email");
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  const prevContact = (before?.contact ?? {}) as Record<string, unknown>;
  const prevHomepage = (before?.homepage ?? {}) as Record<string, unknown>;

  const contact = {
    ...prevContact,
    phone: str("phone"),
    whatsapp: str("whatsapp"),
    email,
    address: str("address"),
  };
  const homepage = {
    ...prevHomepage,
    tagline: str("tagline"),
    description: str("description"),
  };

  const { data: after, error } = await db
    .from("site_settings")
    .upsert({ id: true, contact, homepage })
    .select("*")
    .single();

  if (error) return { ok: false, error: error.message };

  await writeAudit(actor, {
    action: "settings.update",
    entity: "site_settings",
    entityId: "singleton",
    summary: "Updated site settings",
    before,
    after,
  });

  revalidateTag("site-settings");
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  redirectWithToast(
    "/admin/settings",
    "Settings saved — the public site updates shortly",
  );
}
