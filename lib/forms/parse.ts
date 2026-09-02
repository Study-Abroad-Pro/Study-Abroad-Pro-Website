import { mergeFormsConfig, type FormsConfig } from "./config";

/**
 * Turn the `/admin/forms` editor's FormData into a raw forms object.
 *
 * Shared by the server action (which persists it) and the live preview in the
 * editor (which renders it), so the two can never drift. The field names here
 * are the `name=` attributes rendered by `FormsEditor.tsx`.
 */

function list(fd: FormData, prefix: string): string[] {
  const re = new RegExp(`^${prefix}\\[(\\d+)\\]$`);
  const rows: [number, string][] = [];
  for (const [k, v] of fd.entries()) {
    const m = k.match(re);
    if (m) rows.push([Number(m[1]), String(v).trim()]);
  }
  return rows
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v)
    .filter(Boolean);
}

export function formsFromFormData(fd: FormData): Record<string, unknown> {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const on = (k: string) => fd.get(k) === "on";

  return {
    courseOptions: list(fd, "course_options"),
    counselling: {
      eyebrow: s("c_eyebrow"),
      heading: s("c_heading"),
      intro: s("c_intro"),
      bullets: list(fd, "c_bullets"),
      submitLabel: s("c_submit"),
      reassurance: s("c_reassurance"),
      successHeading: s("c_success_heading"),
      successBody: s("c_success_body"),
      fields: {
        preferred_country: on("c_field_preferred_country"),
        preferred_course: on("c_field_preferred_course"),
        qualification: on("c_field_qualification"),
        intake: on("c_field_intake"),
      },
    },
    contact: {
      submitLabel: s("ct_submit"),
      reassurance: s("ct_reassurance"),
      successHeading: s("ct_success_heading"),
      successBody: s("ct_success_body"),
      showCountry: on("ct_show_country"),
    },
    notify: { email: s("notify_email") },
  };
}

/** Editor FormData → a clean, defaulted `FormsConfig` (for the live preview). */
export function formsConfigFromFormData(fd: FormData): FormsConfig {
  return mergeFormsConfig(formsFromFormData(fd));
}
