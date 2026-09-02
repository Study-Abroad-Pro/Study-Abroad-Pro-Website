"use client";

import { Component, useState, type ReactNode } from "react";
import type { FormsConfig } from "@/lib/forms/config";
import QuickCounsellingForm from "@/components/forms/QuickCounsellingForm";
import ContactForm from "@/components/forms/ContactForm";

/**
 * The preview must never take the editor down with it — if a form component
 * throws for any reason, the Save button has to keep working.
 */
class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <p className="p-4 text-xs text-[#8b93a1]">
          Preview unavailable. Your changes still save normally.
        </p>
      );
    }
    return this.props.children;
  }
}

type Props = { config: FormsConfig; countryOptions: string[] };

/**
 * Live preview for `/admin/forms`. Renders the real public form components in
 * `preview` mode (no submission) from the config currently in the editor, so an
 * admin sees exactly what a visitor sees while they edit.
 */
export default function FormPreview(props: Props) {
  return (
    <PreviewBoundary>
      <PreviewInner {...props} />
    </PreviewBoundary>
  );
}

function PreviewInner({ config, countryOptions }: Props) {
  const [tab, setTab] = useState<"counselling" | "contact">("counselling");
  const c = config.counselling;

  return (
    <div className="overflow-hidden rounded-xl border border-[#e6e8ec] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e8ec] bg-[#fbfcfd] px-3 py-2">
        <div className="flex gap-1">
          {(
            [
              ["counselling", "Counselling form"],
              ["contact", "Contact form"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                tab === key
                  ? "bg-[#171717] text-white"
                  : "text-[#5b6270] hover:bg-[#eef0f3]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#8b93a1]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          Live — what visitors see
        </span>
      </div>

      <div className="max-h-[calc(100vh-9rem)] overflow-y-auto bg-cream p-4 sm:p-5">
        {tab === "counselling" ? (
          <div className="flex flex-col gap-5">
            <div>
              {c.eyebrow ? <p className="label text-brand">{c.eyebrow}</p> : null}
              <h2 className="mt-2.5 text-xl font-extrabold leading-tight text-ink">
                {c.heading}
              </h2>
              {c.intro ? (
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-soft">
                  {c.intro}
                </p>
              ) : null}
              {c.bullets.length > 0 && (
                <ul className="mt-3.5 flex flex-col gap-2">
                  {c.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-soft"
                    >
                      <svg viewBox="0 0 20 20" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M16.5 5.5L8 14l-4.5-4.5" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <QuickCounsellingForm
              preview
              countryOptions={countryOptions}
              courseOptions={config.courseOptions}
              fields={c.fields}
              copy={{
                submitLabel: c.submitLabel,
                reassurance: c.reassurance,
                successHeading: c.successHeading,
                successBody: c.successBody,
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-ink">
              Fill out the form, and our team will contact you
            </p>
            <ContactForm
              preview
              countryOptions={countryOptions}
              showCountry={config.contact.showCountry}
              copy={{
                submitLabel: config.contact.submitLabel,
                reassurance: config.contact.reassurance,
                successHeading: config.contact.successHeading,
                successBody: config.contact.successBody,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
