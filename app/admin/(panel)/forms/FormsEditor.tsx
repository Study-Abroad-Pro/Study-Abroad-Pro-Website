"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";
import { TextInput, TextArea, Toggle, StringList } from "@/components/admin/fields";
import type { FormsConfig } from "@/lib/forms/config";
import { formsConfigFromFormData } from "@/lib/forms/parse";
import { updateForms, type FormsActionState } from "./actions";
import FormPreview from "./FormPreview";

const initial: FormsActionState = { ok: false };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-[#8b93a1]">{description}</p>
        )}
      </div>
      {children}
    </section>
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
      {pending ? "Saving…" : "Save form settings"}
    </button>
  );
}

export default function FormsEditor({
  config,
  countryOptions,
  resendConfigured,
}: {
  config: FormsConfig;
  countryOptions: string[];
  resendConfigured: boolean;
}) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateForms, initial);

  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<FormsConfig>(config);

  // Snapshot the form on every edit so the live preview tracks it. React's
  // `onChange` fires per keystroke for text inputs and on toggle for
  // checkboxes; the click handler catches the StringList add / remove / reorder
  // buttons, which mutate the DOM without firing a change event.
  const sync = useCallback(() => {
    if (formRef.current) {
      setPreview(formsConfigFromFormData(new FormData(formRef.current)));
    }
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button[type="button"]')) {
        setTimeout(sync, 0);
      }
    },
    [sync],
  );

  // Success redirects from the server action; only errors land back here.
  useEffect(() => {
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  const c = config.counselling;
  const ct = config.contact;

  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
      <form
        ref={formRef}
        action={formAction}
        onChange={sync}
        onClick={onClick}
        className="flex min-w-0 flex-1 flex-col gap-6"
      >
        {/* -------------------------------------------------------------- */}
        <Section
          title="Preferred country dropdown"
          description="Filled automatically from your published countries — add or publish a country and it appears in every form. Nothing to edit here."
        >
          <div className="rounded-lg border border-[#e6e8ec] bg-[#fbfcfd] p-3.5">
            {countryOptions.length ? (
              <ul className="flex flex-wrap gap-1.5">
                {countryOptions.map((name) => (
                  <li
                    key={name}
                    className="rounded-md bg-[#eef0f3] px-2.5 py-1 text-[13px] font-medium text-[#3a3532]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#8b93a1]">No published countries yet.</p>
            )}
            <p className="mt-3 text-xs text-[#8b93a1]">
              Manage these in{" "}
              <Link href="/admin/countries" className="font-medium text-[#171717] underline">
                Countries
              </Link>
              .
            </p>
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        <Section
          title="Preferred course options"
          description="The choices in the “Preferred course” dropdown on the counselling form. Order here is the display order."
        >
          <StringList
            label="Course options"
            name="course_options"
            defaultItems={config.courseOptions}
            addLabel="Add course"
            placeholder="e.g. Data Science"
          />
        </Section>

        {/* -------------------------------------------------------------- */}
        <Section
          title="Counselling form"
          description="The “Not sure where to start?” block and its form — shown on the homepage and every country page. Leave a text field blank to keep the built-in wording."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Eyebrow" name="c_eyebrow" defaultValue={c.eyebrow} />
            <TextInput label="Heading" name="c_heading" defaultValue={c.heading} />
          </div>
          <TextArea label="Intro paragraph" name="c_intro" defaultValue={c.intro} rows={3} />
          <StringList
            label="Bullet points"
            name="c_bullets"
            defaultItems={c.bullets}
            addLabel="Add bullet"
            placeholder="What the student gets from the session"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Submit button label" name="c_submit" defaultValue={c.submitLabel} />
            <TextInput
              label="Reassurance line"
              name="c_reassurance"
              defaultValue={c.reassurance}
              hint="Small print under the button"
            />
            <TextInput
              label="Success heading"
              name="c_success_heading"
              defaultValue={c.successHeading}
            />
          </div>
          <TextArea
            label="Success message"
            name="c_success_body"
            defaultValue={c.successBody}
            rows={2}
          />

          <div className="flex flex-col gap-2.5 rounded-lg border border-[#e6e8ec] bg-[#fbfcfd] p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8b93a1]">
              Optional fields
            </span>
            <p className="text-xs text-[#8b93a1]">
              Name, phone and email are always shown and required.
            </p>
            <Toggle
              label="Preferred country"
              name="c_field_preferred_country"
              defaultChecked={c.fields.preferred_country}
            />
            <Toggle
              label="Preferred course"
              name="c_field_preferred_course"
              defaultChecked={c.fields.preferred_course}
            />
            <Toggle
              label="Highest qualification"
              name="c_field_qualification"
              defaultChecked={c.fields.qualification}
            />
            <Toggle
              label="Preferred intake"
              name="c_field_intake"
              defaultChecked={c.fields.intake}
            />
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        <Section
          title="Contact form"
          description="The form on the Contact page. Name, email, phone and message are always required."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Submit button label" name="ct_submit" defaultValue={ct.submitLabel} />
            <TextInput
              label="Reassurance line"
              name="ct_reassurance"
              defaultValue={ct.reassurance}
            />
            <TextInput
              label="Success heading"
              name="ct_success_heading"
              defaultValue={ct.successHeading}
            />
          </div>
          <TextArea
            label="Success message"
            name="ct_success_body"
            defaultValue={ct.successBody}
            rows={2}
          />
          <div className="rounded-lg border border-[#e6e8ec] bg-[#fbfcfd] p-3.5">
            <Toggle
              label="Show a “Preferred country” dropdown"
              name="ct_show_country"
              defaultChecked={ct.showCountry}
              hint="Uses the same auto-synced country list"
            />
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}
        <Section
          title="Lead notifications"
          description="Email an alert whenever a new lead comes in. Leave blank to only see leads in the admin inbox."
        >
          <TextInput
            label="Notify these email addresses"
            name="notify_email"
            type="text"
            defaultValue={config.notify.email}
            placeholder="you@studyabroadpro.com, team@studyabroadpro.com"
            hint="Separate multiple addresses with commas"
          />
          {!resendConfigured && (
            <p className="rounded-lg bg-[#fff5e6] px-3 py-2 text-xs leading-relaxed text-[#8a5a00]">
              Email sending is not switched on yet. Add a{" "}
              <code className="rounded bg-[#ffe9c7] px-1">RESEND_API_KEY</code> to the
              environment to start delivering these alerts — the address is saved
              either way.
            </p>
          )}
        </Section>

        {state.error && (
          <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42318]">
            {state.error}
          </p>
        )}

        <div>
          <SaveButton />
        </div>
      </form>

      {/* live preview -------------------------------------------------- */}
      <aside className="xl:sticky xl:top-6 xl:w-[23rem] xl:shrink-0">
        <p className="mb-2 text-xs font-medium text-[#8b93a1]">Preview</p>
        <FormPreview config={preview} countryOptions={countryOptions} />
      </aside>
    </div>
  );
}
