"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { quickLeadSchema } from "@/lib/schemas";
import type { CounsellingField } from "@/lib/forms/config";
import { Arrow } from "@/components/ui/Button";

type Errors = Partial<Record<"full_name" | "phone" | "email", string>>;

export type CounsellingFormCopy = {
  submitLabel: string;
  reassurance: string;
  successHeading: string;
  successBody: string;
};

const field =
  "w-full rounded-xl bg-white px-4 py-3.5 text-[0.9375rem] text-ink ring-1 ring-ink/10 " +
  "transition-shadow placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand";

// Fallbacks so the form never crashes if a caller passes an incomplete prop
// (e.g. a stale bundle mid-deploy). A lead form going down is not acceptable.
const DEFAULT_FIELDS: Record<CounsellingField, boolean> = {
  preferred_country: true,
  preferred_course: true,
  qualification: false,
  intake: false,
};
const DEFAULT_COPY: CounsellingFormCopy = {
  submitLabel: "Get Free Counselling",
  reassurance: "100% free · No obligation · We never share your details.",
  successHeading: "Thanks — we have your details.",
  successBody:
    "A counsellor will be in touch to arrange your session. If it is urgent, calling is faster than waiting for us to come back to you.",
};

/**
 * The counselling entry point. It validates with the same zod schema the route
 * handler uses, so a submission that skips the UI is rejected by exactly the
 * rules the visitor saw.
 *
 * Which optional fields show, the dropdown options and the surrounding copy all
 * come from `/admin/forms` via props — the parent server component
 * (`<Counselling>`) fetches them. Name, phone and email are always required.
 *
 * Spam control without a third-party captcha: a hidden field bots fill in, and
 * the time the form was on screen. Both are checked server-side too — these
 * are a convenience, not the defence.
 */
export default function QuickCounsellingForm({
  countryOptions = [],
  courseOptions = [],
  fields: fieldsProp,
  copy: copyProp,
  preview = false,
}: {
  countryOptions?: string[];
  courseOptions?: string[];
  fields?: Partial<Record<CounsellingField, boolean>>;
  copy?: Partial<CounsellingFormCopy>;
  /** Render inside the admin editor: no real submission, single column. */
  preview?: boolean;
}) {
  const fields = { ...DEFAULT_FIELDS, ...fieldsProp };
  const copy = { ...DEFAULT_COPY, ...copyProp };
  const pathname = usePathname();
  const mountedAt = useRef(Date.now());
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (preview) {
      setState("done");
      return;
    }
    const data = new FormData(e.currentTarget);
    const pick = (k: string) => String(data.get(k) ?? "").trim() || undefined;

    const payload = {
      form_type: "quick" as const,
      full_name: String(data.get("full_name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      preferred_country: pick("preferred_country"),
      preferred_course: pick("preferred_course"),
      qualification: pick("qualification"),
      intake: pick("intake"),
      company: String(data.get("company") ?? ""),
      elapsed_ms: Date.now() - mountedAt.current,
      source_path: pathname,
    };

    const parsed = quickLeadSchema.safeParse(payload);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({
        full_name: flat.full_name?.[0],
        phone: flat.phone?.[0],
        email: flat.email?.[0],
      });
      return;
    }

    setErrors({});
    setState("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-8 ring-1 ring-ink/8 sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-tint">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 className="font-display text-2xl font-extrabold">{copy.successHeading}</h3>
        <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
          {copy.successBody}
        </p>
        {preview && (
          <button
            type="button"
            onClick={() => setState("idle")}
            className="text-[0.8125rem] font-semibold text-brand underline-offset-4 hover:underline"
          >
            ← Back to the form
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-white p-6 ring-1 ring-ink/8 sm:p-8"
    >
      <div className={preview ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="label text-ink/70">Full name</span>
          <input name="full_name" autoComplete="name" required className={field} placeholder="Your name" />
          {errors.full_name ? <span className="text-[0.8125rem] text-brand">{errors.full_name}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="label text-ink/70">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" required className={field} placeholder="+91 …" />
          {errors.phone ? <span className="text-[0.8125rem] text-brand">{errors.phone}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="label text-ink/70">Email</span>
          <input name="email" type="email" autoComplete="email" required className={field} placeholder="you@example.com" />
          {errors.email ? <span className="text-[0.8125rem] text-brand">{errors.email}</span> : null}
        </label>

        {fields.preferred_country && (
          <label className="flex flex-col gap-2">
            <span className="label text-ink/70">Preferred country</span>
            <select name="preferred_country" defaultValue="" className={field}>
              <option value="">Not sure yet</option>
              {countryOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        )}

        {fields.preferred_course && (
          <label className="flex flex-col gap-2">
            <span className="label text-ink/70">Preferred course</span>
            <select name="preferred_course" defaultValue="" className={field}>
              <option value="">Not sure yet</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}

        {fields.qualification && (
          <label className="flex flex-col gap-2">
            <span className="label text-ink/70">Highest qualification</span>
            <input name="qualification" className={field} placeholder="e.g. B.Sc, 12th, Diploma" />
          </label>
        )}

        {fields.intake && (
          <label className="flex flex-col gap-2">
            <span className="label text-ink/70">Preferred intake</span>
            <input name="intake" className={field} placeholder="e.g. Sept 2026" />
          </label>
        )}
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-7 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(255,50,13,0.75)] transition-colors hover:bg-brand-deep disabled:opacity-60 sm:w-auto"
      >
        {state === "sending" ? "Sending…" : copy.submitLabel}
        {state === "sending" ? null : <Arrow />}
      </button>

      {copy.reassurance ? (
        <p className="mt-4 text-[0.8125rem] text-muted">{copy.reassurance}</p>
      ) : null}

      {state === "error" ? (
        <p role="alert" className="mt-3 text-[0.8125rem] text-brand">
          {message}
        </p>
      ) : null}
    </form>
  );
}
