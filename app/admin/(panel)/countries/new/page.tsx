import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { EMPTY_COUNTRY } from "@/lib/admin/country-form";
import CountryForm from "../CountryForm";

export const dynamic = "force-dynamic";

export default async function NewCountryPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/countries"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Countries
      </Link>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        Add a country
      </h1>
      <p className="-mt-3 max-w-2xl text-sm text-[#5b6270]">
        Fill in as much as you can now — keep it unpublished and finish later, or
        duplicate an existing country to start from a full template. Any section
        you don’t have content for can be switched off with the toggle in its
        header, and it won’t appear on the public page.
      </p>
      <CountryForm mode="create" data={EMPTY_COUNTRY} />
    </div>
  );
}
