import { getServiceSupabase } from "@/lib/supabase/service";
import { mergeFormsConfig } from "@/lib/forms/config";

/**
 * Email a notification for a freshly-stored lead.
 *
 * The recipient address is set at `/admin/forms` (`site_settings.forms.notify`).
 * Sending goes through Resend's REST API and is gated on `RESEND_API_KEY` — with
 * no key configured this is a no-op (logged once), so the feature can be turned
 * on later without a code change. Every failure is swallowed: a lead is already
 * saved by the time this runs and must never surface an error to the visitor.
 *
 * Call it from `after()` in the lead route so it runs past the response.
 */

const FIELD_LABELS: Record<string, string> = {
  full_name: "Name",
  phone: "Phone",
  email: "Email",
  message: "Message",
  preferred_country: "Preferred country",
  preferred_course: "Preferred course",
  qualification: "Qualification",
  year_completed: "Year completed",
  score: "Score",
  english_test: "English test",
  budget: "Budget",
  intake: "Intake",
  current_location: "Current location",
  source_path: "Submitted from",
};

const FORM_LABELS: Record<string, string> = {
  quick: "counselling",
  contact: "contact",
  country: "country",
  eligibility: "eligibility",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyNewLead(
  lead: Record<string, unknown>,
  leadId?: string | null,
): Promise<void> {
  try {
    const { data } = await getServiceSupabase()
      .from("site_settings")
      .select("forms")
      .eq("id", true)
      .maybeSingle();

    const recipients = mergeFormsConfig(data?.forms)
      .notify.email.split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (recipients.length === 0) return;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.info(
        "[leads] notify: a recipient is configured but RESEND_API_KEY is not set — skipping email",
      );
      return;
    }

    const formType = String(lead.form_type ?? "lead");
    const formLabel = FORM_LABELS[formType] ?? formType;
    const name = String(lead.full_name ?? "someone");
    const country = typeof lead.preferred_country === "string" ? lead.preferred_country : "";

    const entries = Object.keys(FIELD_LABELS)
      .filter((k) => lead[k] !== undefined && lead[k] !== null && lead[k] !== "")
      .map((k) => [FIELD_LABELS[k], String(lead[k])] as const);

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
    const adminLink = siteUrl
      ? `${siteUrl}/admin/leads${leadId ? `/${leadId}` : ""}`
      : "";

    const subject = `New ${formLabel} lead — ${name}${country ? ` (${country})` : ""}`;

    const text = [
      `New ${formLabel} enquiry from ${name}.`,
      "",
      ...entries.map(([label, value]) => `${label}: ${value}`),
      ...(adminLink ? ["", `Open in admin: ${adminLink}`] : []),
      "",
      "— Study Abroad Pro website",
    ].join("\n");

    const rowsHtml = entries
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 14px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${esc(
            label,
          )}</td><td style="padding:6px 0;color:#111827;font-size:14px">${esc(value).replace(/\n/g, "<br>")}</td></tr>`,
      )
      .join("");

    const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto">
  <p style="font-size:15px;color:#111827;margin:0 0 4px">New <strong>${esc(
    formLabel,
  )}</strong> enquiry from <strong>${esc(name)}</strong>.</p>
  <table style="border-collapse:collapse;margin:14px 0">${rowsHtml}</table>
  ${
    adminLink
      ? `<p style="margin:18px 0 0"><a href="${esc(
          adminLink,
        )}" style="display:inline-block;background:#ff320d;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:8px">Open in admin</a></p>`
      : ""
  }
  <p style="color:#9ca3af;font-size:12px;margin:22px 0 0">Study Abroad Pro website</p>
</div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.LEADS_NOTIFY_FROM ??
          "Study Abroad Pro <onboarding@resend.dev>",
        to: recipients,
        reply_to: typeof lead.email === "string" ? lead.email : undefined,
        subject,
        text,
        html,
      }),
    });

    if (res.ok) {
      console.info(`[leads] notify: emailed ${recipients.length} recipient(s) for ${formType} lead`);
    } else {
      console.error(
        "[leads] notify: Resend returned",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    console.error("[leads] notify failed", err);
  }
}
