import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { mergeFormsConfig } from "@/lib/forms/config";
import FormsEditor from "./FormsEditor";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  await requireAdmin();

  const db = getServiceSupabase();
  const [{ data: settings }, { data: countries }] = await Promise.all([
    db.from("site_settings").select("forms").eq("id", true).maybeSingle(),
    db
      .from("countries")
      .select("name, is_published, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
  ]);

  const config = mergeFormsConfig(settings?.forms);
  const countryOptions = [
    ...new Set((countries ?? []).map((c) => (c.name ?? "").trim()).filter(Boolean)),
  ];

  return (
    <div className="flex max-w-[78rem] flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Forms</h1>
        <p className="text-sm text-[#5b6270]">
          Edit the counselling and contact forms — options, wording and optional
          fields — with a live preview of what visitors see. New leads are
          emailed to the address you set here.
        </p>
      </header>

      <FormsEditor
        config={config}
        countryOptions={countryOptions}
        resendConfigured={Boolean(process.env.RESEND_API_KEY)}
      />
    </div>
  );
}
