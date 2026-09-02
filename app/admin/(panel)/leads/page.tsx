import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { LEAD_STATUSES } from "@/components/admin/StatusBadge";
import LeadStatusSelect from "@/components/admin/LeadStatusSelect";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const FORM_TYPES = ["quick", "country", "contact", "eligibility"] as const;

type SP = Promise<{
  status?: string;
  type?: string;
  q?: string;
  page?: string;
}>;

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const sp = await searchParams;

  const status = LEAD_STATUSES.includes(sp.status as never) ? sp.status : "";
  const type = FORM_TYPES.includes(sp.type as never) ? sp.type : "";
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const db = getServiceSupabase();
  let query = db
    .from("leads")
    .select(
      "id, full_name, email, phone, form_type, status, preferred_country, preferred_course, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status) query = query.eq("status", status);
  if (type) query = query.eq("form_type", type);
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`,
    );
  }

  const { data: leads, count } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const buildHref = (patch: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, type, q, page, ...patch };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== "" && v !== undefined && !(k === "page" && v === 1)) {
        params.set(k, String(v));
      }
    }
    const s = params.toString();
    return s ? `/admin/leads?${s}` : "/admin/leads";
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Leads
        </h1>
        <p className="text-sm text-[#5b6270]">
          {total} {total === 1 ? "enquiry" : "enquiries"}
          {status || type || q ? " matching your filters" : " in total"}.
        </p>
      </header>

      {/* Filters */}
      <form
        method="GET"
        className="flex flex-wrap items-end gap-3 rounded-xl border border-[#e6e8ec] bg-white p-4"
      >
        <label className="flex flex-col gap-1 text-xs font-medium text-[#5b6270]">
          Search
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Name, email or phone"
            className="w-56 rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm text-[#16181d] outline-none focus:border-[#171717]"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-[#5b6270]">
          Status
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm text-[#16181d] outline-none focus:border-[#171717]"
          >
            <option value="">All</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-[#5b6270]">
          Form
          <select
            name="type"
            defaultValue={type}
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm text-[#16181d] outline-none focus:border-[#171717]"
          >
            <option value="">All</option>
            {FORM_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-lg bg-[#171717] px-4 py-2 text-sm font-semibold text-white"
        >
          Apply
        </button>
        {(status || type || q) && (
          <Link
            href="/admin/leads"
            className="px-2 py-2 text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#e6e8ec] bg-white">
        {!leads || leads.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[#8b93a1]">
            No leads found.
          </p>
        ) : (
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-[#e6e8ec] text-left text-xs uppercase tracking-wide text-[#8b93a1]">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Interest</th>
                <th className="px-5 py-3 font-medium">Form</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef0f3]">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-[#f9fafb]">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="font-medium text-[#16181d] hover:text-[#ff320d]"
                    >
                      {l.full_name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[#5b6270]">
                    <span className="block">{l.email}</span>
                    <span className="block text-xs text-[#8b93a1]">
                      {l.phone}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#5b6270]">
                    {[l.preferred_country, l.preferred_course]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded bg-[#eef0f3] px-1.5 py-0.5 text-[11px] font-medium capitalize text-[#5b6270]">
                      {l.form_type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <LeadStatusSelect id={l.id} status={l.status} />
                  </td>
                  <td className="px-5 py-3 tabular-nums text-xs text-[#8b93a1]">
                    {dateFmt.format(new Date(l.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#8b93a1]">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: page - 1 })}
                className="rounded-lg border border-[#d7dbe0] px-3 py-1.5 font-medium text-[#16181d] hover:bg-[#f3f4f6]"
              >
                Previous
              </Link>
            )}
            {page < pages && (
              <Link
                href={buildHref({ page: page + 1 })}
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
