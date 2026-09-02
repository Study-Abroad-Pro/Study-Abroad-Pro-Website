import { requireSuperadmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import AddAdminForm from "./AddAdminForm";
import { setAdminRole, removeAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await requireSuperadmin();
  const db = getServiceSupabase();

  const [{ data: profiles }, { data: authList }] = await Promise.all([
    db
      .from("admin_profiles")
      .select("user_id, role, full_name, created_at")
      .order("created_at", { ascending: true }),
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const emailById = new Map(
    (authList?.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Admin users
        </h1>
        <p className="text-sm text-[#5b6270]">
          Everyone with access to this panel. Superadmins can manage countries,
          blog, settings and other admins.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-[#e6e8ec] bg-white">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b border-[#e6e8ec] text-left text-xs uppercase tracking-wide text-[#8b93a1]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Added</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef0f3]">
            {(profiles ?? []).map((p) => {
              const isSelf = p.user_id === session.userId;
              return (
                <tr key={p.user_id} className="hover:bg-[#f9fafb]">
                  <td className="px-5 py-3 font-medium text-[#16181d]">
                    {p.full_name ?? "—"}
                    {isSelf && (
                      <span className="ml-2 text-xs font-normal text-[#8b93a1]">
                        (you)
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#5b6270]">
                    {emailById.get(p.user_id) ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    {isSelf ? (
                      <span className="rounded bg-[#171717] px-1.5 py-0.5 text-[11px] font-semibold uppercase text-white">
                        {p.role}
                      </span>
                    ) : (
                      <form action={setAdminRole}>
                        <input type="hidden" name="user_id" value={p.user_id} />
                        <select
                          name="role"
                          defaultValue={p.role}
                          className="rounded-lg border border-[#d7dbe0] px-2 py-1 text-xs outline-none focus:border-[#171717]"
                        >
                          <option value="editor">editor</option>
                          <option value="superadmin">superadmin</option>
                        </select>
                        <button
                          type="submit"
                          className="ml-2 text-xs font-medium text-[#5b6270] hover:text-[#16181d]"
                        >
                          Save
                        </button>
                      </form>
                    )}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-xs text-[#8b93a1]">
                    {dateFmt.format(new Date(p.created_at))}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {!isSelf && (
                      <form action={removeAdmin} className="inline">
                        <input type="hidden" name="user_id" value={p.user_id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-[#b42318] hover:underline"
                        >
                          Revoke
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddAdminForm />
    </div>
  );
}
