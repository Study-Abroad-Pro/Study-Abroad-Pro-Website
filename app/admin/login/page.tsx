import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalAdmin } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getOptionalAdmin();
  if (session) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f9] px-5 py-16 font-sans text-[#16181d]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#171717] text-sm font-bold text-white">
            SA
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold tracking-tight">
              Study Abroad Pro
            </h1>
            <p className="text-sm text-[#5b6270]">Control panel</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6e8ec] bg-white p-6 shadow-[0_1px_20px_-12px_rgba(20,24,35,0.25)]">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-[#8b93a1]">
          Authorised staff only. All actions are logged.
        </p>
      </div>
    </main>
  );
}
