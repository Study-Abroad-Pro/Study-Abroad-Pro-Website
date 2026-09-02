import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { StatusBadge } from "@/components/admin/StatusBadge";
import LeadForm from "./LeadForm";

export const dynamic = "force-dynamic";

const FIELD_LABELS: Record<string, string> = {
  phone: "Phone",
  email: "Email",
  preferred_country: "Preferred country",
  preferred_course: "Preferred course",
  qualification: "Qualification",
  year_completed: "Year completed",
  score: "Score",
  english_test: "English test",
  budget: "Budget",
  intake: "Intake",
  current_location: "Current location",
  message: "Message",
  source_path: "Submitted from",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const db = getServiceSupabase();
  const { data: lead } = await db
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!lead) notFound();

  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const detailRows = Object.entries(FIELD_LABELS)
    .map(([key, label]) => [label, lead[key as keyof typeof lead]] as const)
    .filter(([, value]) => value !== null && value !== undefined && value !== "");

  const utm =
    lead.utm && typeof lead.utm === "object"
      ? (lead.utm as Record<string, string>)
      : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        All leads
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {lead.full_name}
          </h1>
          <p className="flex items-center gap-2 text-sm text-[#5b6270]">
            <StatusBadge status={lead.status} />
            <span className="rounded bg-[#eef0f3] px-1.5 py-0.5 text-[11px] font-medium capitalize text-[#5b6270]">
              {lead.form_type}
            </span>
            <span className="text-xs text-[#8b93a1]">
              {dateFmt.format(new Date(lead.created_at))}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`mailto:${lead.email}`}
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm font-medium text-[#16181d] hover:bg-[#f3f4f6]"
          >
            Email
          </a>
          <a
            href={`tel:${lead.phone.replace(/\s/g, "")}`}
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm font-medium text-[#16181d] hover:bg-[#f3f4f6]"
          >
            Call
          </a>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Details */}
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-[#e6e8ec] bg-white">
            <h2 className="border-b border-[#e6e8ec] px-5 py-3 text-sm font-semibold">
              Submission
            </h2>
            <dl className="divide-y divide-[#eef0f3]">
              {detailRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[9rem_1fr] gap-3 px-5 py-3 text-sm"
                >
                  <dt className="text-[#8b93a1]">{label}</dt>
                  <dd className="whitespace-pre-wrap break-words text-[#16181d]">
                    {String(value)}
                  </dd>
                </div>
              ))}
              {utm && Object.keys(utm).length > 0 && (
                <div className="grid grid-cols-[9rem_1fr] gap-3 px-5 py-3 text-sm">
                  <dt className="text-[#8b93a1]">UTM</dt>
                  <dd className="break-words font-mono text-xs text-[#5b6270]">
                    {Object.entries(utm)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(" · ")}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        {/* Manage */}
        <div className="lg:sticky lg:top-7 lg:self-start">
          <LeadForm
            id={lead.id}
            status={lead.status}
            notes={lead.notes ?? ""}
            contactedAt={
              lead.contacted_at
                ? dateFmt.format(new Date(lead.contacted_at))
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
