"use client";

import { useRef, useState } from "react";
import { useToast } from "./Toast";

const MAX_BYTES = 6 * 1024 * 1024;
const OK_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif"];

type Dims = { w: number; h: number };

function readDimensions(file: File): Promise<Dims | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function ImageDropField({
  label,
  name,
  defaultKey = "",
  defaultUrl = "",
  hint,
  uploadAction,
  recommend,
  aspect = "square",
}: {
  label: string;
  name: string;
  defaultKey?: string;
  defaultUrl?: string;
  hint?: string;
  uploadAction: (
    formData: FormData,
  ) => Promise<{ ok: boolean; key?: string; url?: string; error?: string }>;
  /** Shown prominently in the drop zone, e.g. "1600 × 900 px". */
  recommend?: string;
  /** Preview shape. "wide" shows a 16:9 thumbnail (for covers/banners). */
  aspect?: "square" | "wide";
}) {
  const { toast } = useToast();
  const [key, setKey] = useState(defaultKey);
  const [url, setUrl] = useState(defaultUrl);
  const [dims, setDims] = useState<Dims | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!OK_TYPES.includes(file.type)) {
      toast("Use a PNG, JPG, WEBP, AVIF or SVG image.", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast("That image is over 6 MB — please pick a smaller one.", "error");
      return;
    }

    setBusy(true);
    const measured = await readDimensions(file);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadAction(fd);
    setBusy(false);

    if (!res.ok || !res.key) {
      toast(res.error ?? "Upload failed.", "error");
      return;
    }
    setKey(res.key);
    setUrl(res.url ?? "");
    setDims(measured);
    toast(
      measured
        ? `Image uploaded — ${measured.w} × ${measured.h} px.`
        : "Image uploaded.",
      "success",
    );
  }

  const previewClass =
    aspect === "wide"
      ? "aspect-video w-full max-w-sm rounded-lg object-cover ring-1 ring-[#e6e8ec]"
      : "h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-[#e6e8ec]";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#3a3532]">{label}</span>
      <input type="hidden" name={name} value={key} />
      <input
        ref={inputRef}
        type="file"
        accept={OK_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {url ? (
        <div
          className={`rounded-xl border border-[#e6e8ec] bg-white p-3 ${
            aspect === "wide" ? "flex flex-col gap-3" : "flex items-center gap-4"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Current" className={previewClass} />
          <div className="flex flex-1 flex-col gap-1">
            <p className="truncate text-xs text-[#5b6270]">
              {key}
              {dims && (
                <span className="ml-2 text-[#8b93a1]">
                  {dims.w} × {dims.h} px
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs font-semibold text-[#ff320d] hover:underline"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  setKey("");
                  setUrl("");
                  setDims(null);
                }}
                className="text-xs font-medium text-[#5b6270] hover:text-[#b42318]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`admin-drop flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#d7dbe0] bg-white px-4 py-8 text-center transition-colors hover:border-[#c9cdd4] ${
            dragging ? "is-dragging" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#b6bcc7]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15V3m0 0-4 4m4-4 4 4" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <span className="text-sm font-medium text-[#5b6270]">
            {busy ? "Uploading…" : "Drag an image here, or click to choose"}
          </span>
          {recommend && (
            <span className="text-xs font-semibold text-[#3a3532]">
              Best size: {recommend}
            </span>
          )}
          <span className="text-xs text-[#8b93a1]">
            PNG, JPG, WEBP, AVIF or SVG · up to 6 MB
          </span>
        </button>
      )}
      {hint && <p className="text-xs text-[#8b93a1]">{hint}</p>}
    </div>
  );
}
