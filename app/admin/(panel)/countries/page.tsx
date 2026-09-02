import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { PublishBadge } from "@/components/admin/StatusBadge";
import { setCountryPublished, duplicateCountry } from "./actions";

export const dynamic = "force-dynamic";

export default async function CountriesPage() {
  await requireAdmin();

  const db = getServiceSupabase();
  const { data: countries } = await db
    .from("countries")
    .select("id, name, slug, code, sort_order, is_published, updated_at")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Countries
          </h1>
          <p className="text-sm text-[#5b6270]">
            {countries?.length ?? 0} destination
            {(countries?.length ?? 0) === 1 ? "" : "s"}. Lower sort order shows
            first on the site.
          </p>
        </div>
        <Link
          href="/admin/countries/new"
          className="rounded-lg bg-[#ff320d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d92306]"
        >
          Add country
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-[#e6e8ec] bg-white">
        <table className="w-full min-w-[42rem] text-sm">
          <thead>
            <tr className="border-b border-[#e6e8ec] text-left text-xs uppercase tracking-wide text-[#8b93a1]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef0f3]">
            {(countries ?? []).map((c) => (
              <tr key={c.id} className="hover:bg-[#f9fafb]">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/countries/${c.id}`}
                    className="font-medium text-[#16181d] hover:text-[#ff320d]"
                  >
                    {c.name}
                  </Link>
                  <span className="ml-2 rounded bg-[#eef0f3] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#8b93a1]">
                    {c.code}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-[#5b6270]">
                  /{c.slug}
                </td>
                <td className="px-5 py-3 tabular-nums text-[#5b6270]">
                  {c.sort_order}
                </td>
                <td className="px-5 py-3">
                  <PublishBadge published={c.is_published} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <form action={setCountryPublished}>
                      <input type="hidden" name="id" value={c.id} />
                      <input
                        type="hidden"
                        name="publish"
                        value={c.is_published ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        className="text-xs font-medium text-[#5b6270] hover:text-[#16181d]"
                      >
                        {c.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={duplicateCountry}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-[#5b6270] hover:text-[#16181d]"
                      >
                        Duplicate
                      </button>
                    </form>
                    <Link
                      href={`/admin/countries/${c.id}`}
                      className="text-xs font-semibold text-[#ff320d] hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
