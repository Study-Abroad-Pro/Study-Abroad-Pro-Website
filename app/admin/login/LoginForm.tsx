"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const messages: Record<string, string> = {
  "not-authorised":
    "That account isn't set up for the admin panel. Ask a superadmin to add you.",
  forbidden: "You don't have access to that section.",
};

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const initialError = messages[params.get("error") ?? ""] ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setBusy(false);
      return;
    }

    // The session cookie is set; let the server re-read it.
    router.replace(next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h2 className="text-base font-semibold">Sign in</h2>

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[#fdecec] px-3 py-2 text-sm text-[#b42318]"
        >
          {error}
        </p>
      ) : null}

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-[#3a3532]">Email</span>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-[#d7dbe0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-[#3a3532]">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-[#d7dbe0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="mt-1 rounded-lg bg-[#ff320d] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d92306] disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
