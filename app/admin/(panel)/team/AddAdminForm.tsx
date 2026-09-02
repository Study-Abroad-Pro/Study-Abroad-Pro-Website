"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/admin/Toast";
import { addAdmin, type TeamActionState } from "./actions";

const initial: TeamActionState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#171717] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Adding…" : "Add admin"}
    </button>
  );
}

export default function AddAdminForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(addAdmin, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      ref.current?.reset();
      toast("Admin added.", "success");
    }
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  return (
    <form
      ref={ref}
      action={formAction}
      className="flex flex-col gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5"
    >
      <div>
        <h2 className="text-sm font-semibold">Add an admin</h2>
        <p className="mt-1 text-xs text-[#8b93a1]">
          Creates a Supabase auth user and grants panel access. Share the
          password with them over a secure channel — they can change it later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#3a3532]">Email</span>
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#3a3532]">Full name</span>
          <input
            name="full_name"
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#3a3532]">Temporary password</span>
          <input
            name="password"
            minLength={10}
            required
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
          />
          <span className="text-xs text-[#8b93a1]">At least 10 characters</span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#3a3532]">Role</span>
          <select
            name="role"
            defaultValue="editor"
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
          >
            <option value="editor">Editor</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </label>
      </div>

      {state.error && (
        <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-xs text-[#b42318]">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-[#e4f6ec] px-3 py-2 text-xs text-[#047857]">
          Admin added.
        </p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
