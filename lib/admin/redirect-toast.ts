import { redirect } from "next/navigation";
import type { ToastKind } from "@/components/admin/Toast";

/**
 * Redirect after a mutating server action, carrying a toast message.
 * `ToastOnMount` in the panel layout shows it and strips the params.
 *
 * A short nonce (`_t`) keeps every redirect's query unique so the toast fires
 * again even when the message text is identical to the previous one.
 */
export function redirectWithToast(
  path: string,
  message: string,
  kind: ToastKind = "success",
): never {
  const params = new URLSearchParams({
    toast: message,
    _t: Date.now().toString(36),
  });
  if (kind !== "success") params.set("toastKind", kind);
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}${params.toString()}`);
}
