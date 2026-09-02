"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast, type ToastKind } from "./Toast";

/**
 * Shows a toast from a `?toast=` / `?toastKind=` query param (set by
 * `redirectWithToast`), then strips those params from the URL.
 *
 * Lives in the persistent panel layout, so it keys off the `_t` nonce rather
 * than a "have I run" flag — otherwise only the first toast of a session fires.
 */
export default function ToastOnMount() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const firedFor = useRef<string | null>(null);

  useEffect(() => {
    const message = params.get("toast");
    if (!message) {
      firedFor.current = null;
      return;
    }

    const nonce = params.get("_t") ?? message;
    if (firedFor.current === nonce) return;
    firedFor.current = nonce;

    const kind = (params.get("toastKind") as ToastKind) || "success";
    toast(message, kind);

    const next = new URLSearchParams(params);
    next.delete("toast");
    next.delete("toastKind");
    next.delete("_t");
    const qs = next.toString();
    // Let the redirect settle first, then strip via the router so Next keeps
    // its own URL state in sync.
    const t = window.setTimeout(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 0);
    return () => window.clearTimeout(t);
  }, [params, pathname, router, toast]);

  return null;
}
