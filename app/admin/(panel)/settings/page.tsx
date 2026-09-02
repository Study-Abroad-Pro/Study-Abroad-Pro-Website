import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import SettingsForm, { type SettingsData } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();

  const { data } = await getServiceSupabase()
    .from("site_settings")
    .select("contact, homepage")
    .eq("id", true)
    .maybeSingle();

  const contact = (data?.contact ?? {}) as Record<string, string>;
  const homepage = (data?.homepage ?? {}) as Record<string, string>;

  const values: SettingsData = {
    phone: contact.phone ?? "",
    whatsapp: contact.whatsapp ?? "",
    email: contact.email ?? "",
    address: contact.address ?? "",
    tagline: homepage.tagline ?? "",
    description: homepage.description ?? "",
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Site settings
        </h1>
        <p className="text-sm text-[#5b6270]">
          Contact details and homepage copy for the public site.
        </p>
      </header>

      <SettingsForm data={values} />
    </div>
  );
}
