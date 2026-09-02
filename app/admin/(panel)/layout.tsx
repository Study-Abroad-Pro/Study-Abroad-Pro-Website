import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/admin/SignOutButton";
import { ToastProvider } from "@/components/admin/Toast";
import ToastOnMount from "@/components/admin/ToastOnMount";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The admin area is per-request (session, live data) — never statically cached.
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const initials =
    (session.fullName ?? session.email)
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "SA";

  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <ToastOnMount />
      </Suspense>
      <div className="min-h-screen bg-[#f6f7f9] font-sans text-[#16181d]">
        <div className="mx-auto flex w-full max-w-[88rem] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="sticky top-0 z-20 flex h-auto shrink-0 flex-col gap-6 border-b border-[#e6e8ec] bg-white px-5 py-5 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:py-7">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#171717] text-[13px] font-bold text-white">
                SA
              </span>
              <span className="text-sm font-semibold leading-tight">
                Study Abroad Pro
                <span className="block text-xs font-medium text-[#8b93a1]">
                  Control panel
                </span>
              </span>
            </Link>
          </div>

          <div className="lg:flex-1">
            <AdminNav role={session.role} />
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e6e8ec] pt-4">
            <div className="flex items-center gap-3 px-1">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef0f3] text-xs font-semibold text-[#5b6270]">
                {initials}
              </span>
              <span className="min-w-0 text-xs leading-tight">
                <span className="block truncate font-semibold text-[#16181d]">
                  {session.fullName ?? "Admin"}
                </span>
                <span className="block truncate text-[#8b93a1]">
                  {session.email}
                </span>
                <span className="mt-0.5 inline-block rounded bg-[#171717] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {session.role}
                </span>
              </span>
            </div>
            <SignOutButton />
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10">{children}</main>
      </div>
      </div>
    </ToastProvider>
  );
}
