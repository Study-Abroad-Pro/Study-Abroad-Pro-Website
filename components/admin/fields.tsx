"use client";

import { useId, useState } from "react";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

let counter = 0;
export const uid = () => `k${Date.now().toString(36)}${(counter++).toString(36)}`;

const inputBase =
  "rounded-lg border border-[#d7dbe0] bg-white px-3 py-2 text-sm text-[#16181d] outline-none transition-colors focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10";

/* ------------------------------------------------------------------ */
/* simple fields                                                       */
/* ------------------------------------------------------------------ */

export function TextInput({
  label,
  name,
  defaultValue,
  hint,
  placeholder,
  required,
  type = "text",
  onValueChange,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  onValueChange?: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#3a3532]">
        {label}
        {required && <span className="text-[#b42318]"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
        className={inputBase}
      />
      {hint && <p className="text-xs text-[#8b93a1]">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  hint,
  placeholder,
  rows = 3,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#3a3532]">
        {label}
        {required && <span className="text-[#b42318]"> *</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={`${inputBase} resize-y leading-relaxed`}
      />
      {hint && <p className="text-xs text-[#8b93a1]">{hint}</p>}
    </div>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-center gap-2.5 text-sm">
        <input
          id={id}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="h-4 w-4 rounded border-[#d7dbe0] text-[#ff320d] focus:ring-[#171717]/20"
        />
        <span className="font-medium text-[#3a3532]">{label}</span>
      </label>
      {hint && <p className="text-xs text-[#8b93a1]">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* chip list — for short values (intakes, languages, course items)     */
/* ------------------------------------------------------------------ */

export function ChipList({
  label,
  name,
  defaultItems = [],
  hint,
  placeholder = "Type and press Enter",
  compact,
}: {
  label?: string;
  name: string;
  defaultItems?: string[];
  hint?: string;
  placeholder?: string;
  compact?: boolean;
}) {
  const [items, setItems] = useState<string[]>(defaultItems);
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) setItems((cur) => [...cur, ...parts.filter((p) => !cur.includes(p))]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className={`text-sm font-medium text-[#3a3532] ${compact ? "sr-only" : ""}`}>
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#d7dbe0] bg-white p-1.5 focus-within:border-[#171717] focus-within:ring-2 focus-within:ring-[#171717]/10">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1 rounded-md bg-[#eef0f3] py-1 pl-2.5 pr-1 text-[13px] font-medium text-[#3a3532]"
          >
            {item}
            <input type="hidden" name={`${name}[${i}]`} value={item} />
            <button
              type="button"
              onClick={() => setItems((cur) => cur.filter((_, j) => j !== i))}
              aria-label={`Remove ${item}`}
              className="grid h-4 w-4 place-items-center rounded text-[#8b93a1] hover:bg-[#dfe3e8] hover:text-[#16181d]"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && items.length) {
              setItems((cur) => cur.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={items.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none"
        />
      </div>
      {hint && <p className="text-xs text-[#8b93a1]">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* string list — one text input per row, add / remove / reorder        */
/* ------------------------------------------------------------------ */

function MoveButtons({
  onUp,
  onDown,
  onRemove,
  first,
  last,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  first: boolean;
  last: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        onClick={onUp}
        disabled={first}
        aria-label="Move up"
        className="grid h-7 w-7 place-items-center rounded text-[#8b93a1] hover:bg-[#eef0f3] hover:text-[#16181d] disabled:opacity-30"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={last}
        aria-label="Move down"
        className="grid h-7 w-7 place-items-center rounded text-[#8b93a1] hover:bg-[#eef0f3] hover:text-[#16181d] disabled:opacity-30"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove"
        className="grid h-7 w-7 place-items-center rounded text-[#b6bcc7] hover:bg-[#fdecec] hover:text-[#b42318]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
    </button>
    </div>
  );
}

type Row = { key: string; value: string };

export function StringList({
  label,
  name,
  defaultItems = [],
  hint,
  placeholder,
  textarea,
  addLabel = "Add item",
}: {
  label: string;
  name: string;
  defaultItems?: string[];
  hint?: string;
  placeholder?: string;
  textarea?: boolean;
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>(
    defaultItems.length
      ? defaultItems.map((value) => ({ key: uid(), value }))
      : [{ key: uid(), value: "" }],
  );

  const move = (i: number, dir: -1 | 1) => {
    setRows((cur) => {
      const next = [...cur];
      const j = i + dir;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#3a3532]">{label}</span>
        {hint && <span className="text-xs text-[#8b93a1]">{hint}</span>}
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={row.key} className="flex items-start gap-2">
            {textarea ? (
              <textarea
                name={`${name}[${i}]`}
                defaultValue={row.value}
                rows={2}
                placeholder={placeholder}
                className={`${inputBase} flex-1 resize-y`}
              />
            ) : (
              <input
                name={`${name}[${i}]`}
                defaultValue={row.value}
                placeholder={placeholder}
                className={`${inputBase} flex-1`}
              />
            )}
            <MoveButtons
              first={i === 0}
              last={i === rows.length - 1}
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
              onRemove={() =>
                setRows((cur) =>
                  cur.length > 1 ? cur.filter((_, j) => j !== i) : cur,
                )
              }
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRows((cur) => [...cur, { key: uid(), value: "" }])}
        className="self-start rounded-lg border border-dashed border-[#c9cdd4] px-3 py-1.5 text-xs font-medium text-[#5b6270] hover:border-[#ff320d] hover:text-[#ff320d]"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* object repeater — a card per row with typed sub-fields              */
/* ------------------------------------------------------------------ */

export type RepeaterField =
  | { key: string; label: string; type: "text"; placeholder?: string }
  | { key: string; label: string; type: "textarea"; placeholder?: string; rows?: number }
  | { key: string; label: string; type: "chips"; placeholder?: string };

type RowData = Record<string, string | string[] | undefined>;

export function ObjectList({
  label,
  name,
  fields,
  defaultItems = [],
  addLabel = "Add",
  hint,
}: {
  label: string;
  name: string;
  fields: RepeaterField[];
  defaultItems?: RowData[];
  addLabel?: string;
  hint?: string;
}) {
  const [rows, setRows] = useState<{ key: string; data: RowData }[]>(
    defaultItems.length
      ? defaultItems.map((data) => ({ key: uid(), data }))
      : [{ key: uid(), data: {} }],
  );

  const move = (i: number, dir: -1 | 1) => {
    setRows((cur) => {
      const next = [...cur];
      const j = i + dir;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#3a3532]">{label}</span>
        {hint && <span className="text-xs text-[#8b93a1]">{hint}</span>}
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className="rounded-lg border border-[#e6e8ec] bg-[#fbfcfd] p-3.5"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8b93a1]">
                {label.replace(/s$/, "")} {i + 1}
              </span>
              <MoveButtons
                first={i === 0}
                last={i === rows.length - 1}
                onUp={() => move(i, -1)}
                onDown={() => move(i, 1)}
                onRemove={() =>
                  setRows((cur) =>
                    cur.length > 1 ? cur.filter((_, j) => j !== i) : cur,
                  )
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              {fields.map((f) => {
                const fieldName = `${name}[${i}][${f.key}]`;
                const initial = row.data[f.key];
                if (f.type === "chips") {
                  return (
                    <div key={f.key} className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#5b6270]">
                        {f.label}
                      </span>
                      <ChipList
                        name={fieldName}
                        defaultItems={Array.isArray(initial) ? (initial as string[]) : []}
                        placeholder={f.placeholder}
                        compact
                      />
                    </div>
                  );
                }
                if (f.type === "textarea") {
                  return (
                    <label key={f.key} className="flex flex-col gap-1 text-xs">
                      <span className="font-medium text-[#5b6270]">{f.label}</span>
                      <textarea
                        name={fieldName}
                        defaultValue={typeof initial === "string" ? initial : ""}
                        rows={f.rows ?? 2}
                        placeholder={f.placeholder}
                        className={`${inputBase} resize-y text-sm`}
                      />
                    </label>
                  );
                }
                return (
                  <label key={f.key} className="flex flex-col gap-1 text-xs">
                    <span className="font-medium text-[#5b6270]">{f.label}</span>
                    <input
                      name={fieldName}
                      defaultValue={typeof initial === "string" ? initial : ""}
                      placeholder={f.placeholder}
                      className={`${inputBase} text-sm`}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((cur) => [...cur, { key: uid(), data: {} }])}
        className="self-start rounded-lg border border-dashed border-[#c9cdd4] px-3 py-1.5 text-xs font-medium text-[#5b6270] hover:border-[#ff320d] hover:text-[#ff320d]"
      >
        + {addLabel}
      </button>
    </div>
  );
}
