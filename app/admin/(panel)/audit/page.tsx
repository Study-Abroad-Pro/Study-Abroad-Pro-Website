import Link from "next/link";
import { requireSuperadmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const ENTITIES = ["lead", "country", "post", "site_settings", "admin_profile"] as const;

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; page?: string }>;
}) {
  await requireSuperadmin();
  const sp = await searchParams;
  const entity = ENTITIES.includes(sp.entity as never) ? sp.entity : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const db = getServiceSupabase();
  let query = db
    .from("admin_audit")
    .select("id, at, actor_email, action, entity, summary", { count: "exact" })
    .order("at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (entity) query = query.eq("entity", entity);

  const { data: rows, count } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fmt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const tab = (value: string, label: string) => {
    const active = entity === value;
    return (
      <Link
        key={value || "all"}
        href={value ? `/admin/audit?entity=${value}` : "/admin/audit"}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
          active
            ? "bg-[#171717] text-white"
            : "bg-white text-[#5b6270] ring-1 ring-[#e6e8ec] hover:text-[#16181d]"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Activity log
        </h1>
        <p className="text-sm text-[#5b6270]">
          Every change made in the panel. {total} entr{total === 1 ? "y" : "ies"}.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {tab("", "All")}
        {tab("lead", "Leads")}
        {tab("country", "Countries")}
        {tab("post", "Blog")}
        {tab("site_settings", "Settings")}
        {tab("admin_profile", "Admins")}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#e6e8ec] bg-white">
        {!rows || rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[#8b93a1]">
            No activity recorded yet.
          </p>
        ) : (
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-[#e6e8ec] text-left text-xs uppercase tracking-wide text-[#8b93a1]">
                <th className="px-5 py-3 font-medium">When</th>
                <th className="px-5 py-3 font-medium">Who</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef0f3]">
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="whitespace-nowrap px-5 py-3 tabular-nums text-xs text-[#8b93a1]">
                    {fmt.format(new Date(r.at))}
                  </td>
                  <td className="px-5 py-3 text-[#5b6270]">{r.actor_email ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className="rounded bg-[#eef0f3] px-1.5 py-0.5 font-mono text-[11px] text-[#5b6270]">
                      {r.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#16181d]">{r.summary ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#8b93a1]">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/audit?${entity ? `entity=${entity}&` : ""}page=${page - 1}`}
                className="rounded-lg border border-[#d7dbe0] px-3 py-1.5 font-medium text-[#16181d] hover:bg-[#f3f4f6]"
              >
                Previous
              </Link>
            )}
            {page < pages && (
              <Link
                href={`/admin/audit?${entity ? `entity=${entity}&` : ""}page=${page + 1}`}
                className="rounded-lg border border-[#d7dbe0] px-3 py-1.5 font-medium text-[#16181d] hover:bg-[#f3f4f6]"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
