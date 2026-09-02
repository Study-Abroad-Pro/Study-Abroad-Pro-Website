"use server";

import { revalidatePath } from "next/cache";
import { redirectWithToast } from "@/lib/admin/redirect-toast";
import { requireSuperadmin } from "@/lib/admin/auth";
import { writeAudit } from "@/lib/admin/audit";
import { getServiceSupabase } from "@/lib/supabase/service";

export type TeamActionState = { ok: boolean; error?: string };

const ROLES = ["superadmin", "editor"] as const;

export async function addAdmin(
  _prev: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const actor = await requireSuperadmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "editor");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Enter a valid email address." };
  if (password.length < 10)
    return { ok: false, error: "Use a password of at least 10 characters." };
  if (!ROLES.includes(role as never))
    return { ok: false, error: "Unknown role." };

  const db = getServiceSupabase();

  // Re-use an existing auth user with this email if there is one.
  const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  let userId = list?.users.find((u) => u.email?.toLowerCase() === email)?.id;

  if (!userId) {
    const { data: created, error: createErr } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr || !created.user)
      return { ok: false, error: createErr?.message ?? "Could not create the user." };
    userId = created.user.id;
  } else {
    // Existing user — set the password they were given.
    await db.auth.admin.updateUserById(userId, { password });
  }

  const { error } = await db
    .from("admin_profiles")
    .upsert({ user_id: userId, role, full_name: fullName || null });
  if (error) return { ok: false, error: error.message };

  await writeAudit(actor, {
    action: "admin.add",
    entity: "admin_profile",
    entityId: userId,
    summary: `Granted ${role} access to ${email}`,
  });

  revalidatePath("/admin/team");
  return { ok: true };
}

export async function setAdminRole(formData: FormData): Promise<void> {
  const actor = await requireSuperadmin();
  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || !ROLES.includes(role as never)) return;
  if (userId === actor.userId) return; // can't change your own role

  const db = getServiceSupabase();
  await db.from("admin_profiles").update({ role }).eq("user_id", userId);

  await writeAudit(actor, {
    action: "admin.role",
    entity: "admin_profile",
    entityId: userId,
    summary: `Set role to ${role}`,
  });
  revalidatePath("/admin/team");
  redirectWithToast("/admin/team", `Role updated to ${role}`);
}

export async function removeAdmin(formData: FormData): Promise<void> {
  const actor = await requireSuperadmin();
  const userId = String(formData.get("user_id") ?? "");
  if (!userId || userId === actor.userId) return; // can't remove yourself

  const db = getServiceSupabase();
  const { data: profile } = await db
    .from("admin_profiles")
    .select("full_name")
    .eq("user_id", userId)
    .maybeSingle();

  await db.from("admin_profiles").delete().eq("user_id", userId);

  await writeAudit(actor, {
    action: "admin.remove",
    entity: "admin_profile",
    entityId: userId,
    summary: `Revoked admin access from ${profile?.full_name ?? userId}`,
  });
  revalidatePath("/admin/team");
  redirectWithToast(
    "/admin/team",
    `Revoked access for ${profile?.full_name ?? "that user"}`,
  );
}
