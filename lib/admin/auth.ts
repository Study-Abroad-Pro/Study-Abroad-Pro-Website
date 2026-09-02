import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase/service";

/**
 * Server-side session + role verification. Every admin page and server action
 * calls one of these before doing anything — middleware is only a first pass.
 */

export type AdminRole = "superadmin" | "editor";

export type AdminSession = {
  userId: string;
  email: string;
  role: AdminRole;
  fullName: string | null;
};

/**
 * Returns the current admin, or redirects to the login page. Verifies the JWT
 * with the auth server (`getUser`, not `getSession`) and confirms an
 * `admin_profiles` row exists.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // admin_profiles is RLS-guarded and self-referential in its policy; reading
  // it with the service client avoids any policy-recursion surprise and keeps
  // the check to a single indexed lookup.
  const { data: profile } = await getServiceSupabase()
    .from("admin_profiles")
    .select("role, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/admin/login?error=not-authorised");

  return {
    userId: user.id,
    email: user.email ?? "",
    role: (profile.role as AdminRole) ?? "editor",
    fullName: profile.full_name,
  };
}

/** As `requireAdmin`, but also requires the superadmin role. */
export async function requireSuperadmin(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (session.role !== "superadmin") redirect("/admin?error=forbidden");
  return session;
}

/** Non-redirecting variant for the login page (which must render for guests). */
export async function getOptionalAdmin(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await getServiceSupabase()
    .from("admin_profiles")
    .select("role, full_name")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email ?? "",
    role: (profile.role as AdminRole) ?? "editor",
    fullName: profile.full_name,
  };
}
