import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceSupabase } from "@/lib/supabase/service";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

function greetingName(session: { fullName: string | null; email: string }) {
  if (session.fullName) return session.fullName;
  return session.email.split("@")[0];
}

async function counts() {
  const db = getServiceSupabase();
  const head = { count: "exact" as const, head: true };

  const [
    leadsTotal,
    leadsNew,
    leadsContacted,
    countriesTotal,
    countriesPublished,
    postsTotal,
    postsPublished,
  ] = await Promise.all([
    db.from("leads").select("*", head),
    db.from("leads").select("*", head).eq("status", "new"),
    db.from("leads").select("*", head).eq("status", "contacted"),
    db.from("countries").select("*", head),
    db.from("countries").select("*", head).eq("is_published", true),
    db.from("blog_posts").select("*", head),
    db.from("blog_posts").select("*", head).eq("is_published", true),
  ]);

  return {
    leadsTotal: leadsTotal.count ?? 0,
    leadsNew: leadsNew.count ?? 0,
    leadsContacted: leadsContacted.count ?? 0,
    countriesTotal: countriesTotal.count ?? 0,
    countriesPublished: countriesPublished.count ?? 0,
    postsTotal: postsTotal.count ?? 0,
    postsPublished: postsPublished.count ?? 0,
  };
}

async function recentLeads() {
  const db = getServiceSupabase();
  const { data } = await db
    .from("leads")
    .select("id, full_name, email, form_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
}

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const [c, leads] = await Promise.all([counts(), recentLeads()]);

  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Welcome back, {greetingName(session)}.
        </h1>
        <p className="text-sm text-[#5b6270]">
          Everything on the public site is driven from here.
        </p>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total leads"
          value={c.leadsTotal}
          sub={`${c.leadsNew} new`}
          href="/admin/leads"
        />
        <StatCard
          label="Awaiting contact"
          value={c.leadsNew}
          sub={`${c.leadsContacted} in progress`}
          href="/admin/leads?status=new"
          accent
        />
        <StatCard
          label="Countries"
          value={c.countriesTotal}
          sub={`${c.countriesPublished} published`}
          href="/admin/countries"
        />
        <StatCard
          label="Blog posts"
          value={c.postsTotal}
          sub={`${c.postsPublished} published`}
          href="/admin/blog"
        />
      </section>

      {/* Recent leads */}
      <section className="rounded-xl border border-[#e6e8ec] bg-white">
        <div className="flex items-center justify-between border-b border-[#e6e8ec] px-5 py-4">
          <h2 className="text-sm font-semibold">Latest enquiries</h2>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-[#ff320d] hover:underline"
          >
            View all
          </Link>
        </div>

        {leads.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#8b93a1]">
            No leads yet. Submissions from every form on the site land here.
          </p>
        ) : (
          <ul className="divide-y divide-[#eef0f3]">
            {leads.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/admin/leads/${l.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 text-sm hover:bg-[#f9fafb]"
                >
                  <span className="font-medium text-[#16181d]">
                    {l.full_name}
                  </span>
                  <span className="text-[#8b93a1]">{l.email}</span>
                  <span className="ml-auto flex items-center gap-2">
                    <span className="rounded bg-[#eef0f3] px-1.5 py-0.5 text-[11px] font-medium capitalize text-[#5b6270]">
                      {l.form_type}
                    </span>
                    <StatusBadge status={l.status} />
                    <span className="tabular-nums text-xs text-[#8b93a1]">
                      {dateFmt.format(new Date(l.created_at))}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  href?: string;
  accent?: boolean;
}) {
  const className = `flex flex-col gap-1 rounded-xl border p-4 transition-colors ${
    accent
      ? "border-[#ffd9cf] bg-[#fff4f0]"
      : "border-[#e6e8ec] bg-white"
  } ${href ? (accent ? "hover:border-[#ff320d]" : "hover:border-[#c9cdd4]") : ""}`;

  const body = (
    <>
      <span className="text-xs font-medium uppercase tracking-wide text-[#8b93a1]">
        {label}
      </span>
      <span className="font-display text-3xl font-extrabold tabular-nums">
        {value}
      </span>
      <span className="text-xs text-[#5b6270]">{sub}</span>
    </>
  );

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
