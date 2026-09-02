"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/admin/Toast";
import { updateSettings, type SettingsActionState } from "./actions";

const initial: SettingsActionState = { ok: false };

export type SettingsData = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  tagline: string;
  description: string;
};

function Field({
  label,
  name,
  defaultValue,
  hint,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-[#3a3532]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
      />
      {hint && <span className="text-xs text-[#8b93a1]">{hint}</span>}
    </label>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#ff320d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d92306] disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save settings"}
    </button>
  );
}

export default function SettingsForm({ data }: { data: SettingsData }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateSettings, initial);

  // Success redirects from the server action; only errors land back here.
  useEffect(() => {
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5">
        <div>
          <h2 className="text-sm font-semibold">Contact details</h2>
          <p className="mt-1 text-xs text-[#8b93a1]">
            Shown in the header, footer and on the contact page. Leave a field
            blank to fall back to the built-in placeholder.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Phone"
            name="phone"
            defaultValue={data.phone}
            placeholder="+91 98765 43210"
            hint="Shown as-is; the tel: link strips spaces"
          />
          <Field
            label="WhatsApp"
            name="whatsapp"
            defaultValue={data.whatsapp}
            placeholder="+919876543210"
            hint="Digits only for the wa.me link"
          />
          <Field
            label="Email"
            name="email"
            defaultValue={data.email}
            placeholder="hello@studyabroadpro.com"
          />
          <Field
            label="Office address"
            name="address"
            defaultValue={data.address}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5">
        <h2 className="text-sm font-semibold">Homepage copy</h2>
        <Field label="Tagline" name="tagline" defaultValue={data.tagline} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#3a3532]">Site description</span>
          <textarea
            name="description"
            defaultValue={data.description}
            rows={3}
            className="resize-y rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
          />
          <span className="text-xs text-[#8b93a1]">
            Used for SEO metadata and the organisation schema.
          </span>
        </label>
      </section>

      {state.error && (
        <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42318]">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-[#e4f6ec] px-3 py-2 text-sm text-[#047857]">
          Saved. The public site updates within a moment.
        </p>
      )}

      <div>
        <SaveButton />
      </div>
    </form>
  );
}
