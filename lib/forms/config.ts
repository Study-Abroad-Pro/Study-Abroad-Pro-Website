import { COURSE_GROUPS } from "@/content/site";

/**
 * Editable configuration for the public lead-capture forms.
 *
 * Stored as the `forms` jsonb on the `site_settings` singleton, edited at
 * `/admin/forms`. Anything absent from the stored object falls back to the
 * defaults below, so a fresh install (empty `{}`) renders exactly what the
 * components used to hard-code.
 *
 * The "Preferred country" options are NOT stored here — they are derived from
 * the published `countries` table at read time (see `lib/data/forms.ts`), which
 * is what makes a newly-added country show up in the dropdown automatically.
 */

/** Optional fields the counselling form can show. Name/phone/email are always
 *  required and never configurable — that keeps client and server validation
 *  in lock-step. */
export type CounsellingField =
  | "preferred_country"
  | "preferred_course"
  | "qualification"
  | "intake";

export const COUNSELLING_FIELDS: {
  key: CounsellingField;
  label: string;
  kind: "select" | "text";
}[] = [
  { key: "preferred_country", label: "Preferred country", kind: "select" },
  { key: "preferred_course", label: "Preferred course", kind: "select" },
  { key: "qualification", label: "Highest qualification", kind: "text" },
  { key: "intake", label: "Preferred intake", kind: "text" },
];

export type CounsellingFormConfig = {
  eyebrow: string;
  heading: string;
  intro: string;
  bullets: string[];
  submitLabel: string;
  reassurance: string;
  successHeading: string;
  successBody: string;
  fields: Record<CounsellingField, boolean>;
};

export type ContactFormConfig = {
  submitLabel: string;
  reassurance: string;
  successHeading: string;
  successBody: string;
  /** The contact form's one optional field. */
  showCountry: boolean;
};

export type FormsConfig = {
  courseOptions: string[];
  counselling: CounsellingFormConfig;
  contact: ContactFormConfig;
  notify: { email: string };
};

const DEFAULT_COURSE_OPTIONS = [
  ...new Set(COURSE_GROUPS.flatMap((g) => g.courses)),
].sort((a, b) => a.localeCompare(b));

export const FORM_DEFAULTS: FormsConfig = {
  courseOptions: DEFAULT_COURSE_OPTIONS,
  counselling: {
    eyebrow: "Free counselling",
    heading: "Not sure where to start?",
    intro:
      "Most students arrive with a country in mind and a lot of conflicting advice. One session is usually enough to replace that with a shortlist you can act on.",
    bullets: [
      "An honest read on what your profile qualifies you for",
      "Two or three destinations worth considering, and why",
      "What it will actually cost, including living expenses",
      "The intake you should be aiming at, and the deadline behind it",
    ],
    submitLabel: "Get Free Counselling",
    reassurance: "100% free · No obligation · We never share your details.",
    successHeading: "Thanks — we have your details.",
    successBody:
      "A counsellor will be in touch to arrange your session. If it is urgent, calling is faster than waiting for us to come back to you.",
    fields: {
      preferred_country: true,
      preferred_course: true,
      qualification: false,
      intake: false,
    },
  },
  contact: {
    submitLabel: "Send message",
    reassurance: "We reply within one working day · We never share your details.",
    successHeading: "Message sent.",
    successBody:
      "We read every message and reply within one working day. If it is urgent, calling is faster than waiting for us to come back to you.",
    showCountry: false,
  },
  notify: { email: "" },
};

/* ------------------------------------------------------------------ */
/* merge                                                               */
/* ------------------------------------------------------------------ */

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v : fallback;
}

function strList(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback;
  const cleaned = v.map((x) => String(x).trim()).filter(Boolean);
  return cleaned.length ? [...new Set(cleaned)] : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

/**
 * Overlay a stored (partial, untrusted) config on top of the defaults.
 * Every field is validated to its expected type; anything unexpected is
 * ignored in favour of the default.
 */
export function mergeFormsConfig(raw: unknown): FormsConfig {
  const r = (raw ?? {}) as Record<string, unknown>;
  const d = FORM_DEFAULTS;

  const c = (r.counselling ?? {}) as Record<string, unknown>;
  const cf = (c.fields ?? {}) as Record<string, unknown>;
  const ct = (r.contact ?? {}) as Record<string, unknown>;
  const n = (r.notify ?? {}) as Record<string, unknown>;

  return {
    courseOptions: strList(r.courseOptions, d.courseOptions),
    counselling: {
      eyebrow: str(c.eyebrow, d.counselling.eyebrow),
      heading: str(c.heading, d.counselling.heading),
      intro: str(c.intro, d.counselling.intro),
      bullets: strList(c.bullets, d.counselling.bullets),
      submitLabel: str(c.submitLabel, d.counselling.submitLabel),
      reassurance: str(c.reassurance, d.counselling.reassurance),
      successHeading: str(c.successHeading, d.counselling.successHeading),
      successBody: str(c.successBody, d.counselling.successBody),
      fields: {
        preferred_country: bool(
          cf.preferred_country,
          d.counselling.fields.preferred_country,
        ),
        preferred_course: bool(
          cf.preferred_course,
          d.counselling.fields.preferred_course,
        ),
        qualification: bool(cf.qualification, d.counselling.fields.qualification),
        intake: bool(cf.intake, d.counselling.fields.intake),
      },
    },
    contact: {
      submitLabel: str(ct.submitLabel, d.contact.submitLabel),
      reassurance: str(ct.reassurance, d.contact.reassurance),
      successHeading: str(ct.successHeading, d.contact.successHeading),
      successBody: str(ct.successBody, d.contact.successBody),
      showCountry: bool(ct.showCountry, d.contact.showCountry),
    },
    notify: {
      email: typeof n.email === "string" ? n.email.trim() : d.notify.email,
    },
  };
}
