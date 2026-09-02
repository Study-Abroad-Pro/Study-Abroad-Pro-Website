"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/admin/Toast";
import { LEAD_STATUSES } from "@/components/admin/StatusBadge";
import { updateLead, deleteLead, type LeadActionState } from "../actions";

const initial: LeadActionState = { ok: false };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#ff320d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d92306] disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export default function LeadForm({
  id,
  status,
  notes,
  contactedAt,
}: {
  id: string;
  status: string;
  notes: string;
  contactedAt: string | null;
}) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateLead, initial);
  const [delState, delAction] = useActionState(deleteLead, initial);
  const [confirming, setConfirming] = useState(false);

  // Success paths redirect from the server action; only errors land back here.
  useEffect(() => {
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  useEffect(() => {
    if (delState.error) toast(delState.error, "error");
  }, [delState, toast]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5">
      <h2 className="text-sm font-semibold">Manage</h2>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#3a3532]">Status</span>
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#3a3532]">Internal notes</span>
          <textarea
            name="notes"
            defaultValue={notes}
            rows={5}
            placeholder="Not shown to the applicant."
            className="resize-y rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
          />
        </label>

        {contactedAt && (
          <p className="text-xs text-[#8b93a1]">First contacted {contactedAt}</p>
        )}

        {state.error && (
          <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-xs text-[#b42318]">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p className="rounded-lg bg-[#e4f6ec] px-3 py-2 text-xs text-[#047857]">
            Saved.
          </p>
        )}

        <SaveButton />
      </form>

      <div className="border-t border-[#eef0f3] pt-4">
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-xs font-medium text-[#b42318] hover:underline"
          >
            Delete this lead
          </button>
        ) : (
          <form action={delAction} className="flex flex-col gap-2">
            <input type="hidden" name="id" value={id} />
            <p className="text-xs text-[#5b6270]">
              This can’t be undone. The deletion is logged.
            </p>
            {delState.error && (
              <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-xs text-[#b42318]">
                {delState.error}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-[#b42318] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#951d13]"
              >
                Delete permanently
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-[#d7dbe0] px-3 py-1.5 text-xs font-medium text-[#16181d]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
