"use client";

import { useTransition } from "react";
import { useToast } from "@/components/admin/Toast";
import { LEAD_STATUSES } from "@/components/admin/StatusBadge";
import { setLeadStatus } from "@/app/admin/(panel)/leads/actions";

const LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

const STYLE: Record<string, string> = {
  new: "bg-[#e8efff] text-[#1d4ed8] ring-[#c7dbff]",
  contacted: "bg-[#fef1e0] text-[#b45309] ring-[#f5d9b3]",
  qualified: "bg-[#e4f6ec] text-[#047857] ring-[#bfe6cf]",
  closed: "bg-[#eef0f3] text-[#5b6270] ring-[#dcdfe4]",
};

export default function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <select
      key={status}
      defaultValue={status}
      disabled={pending}
      aria-label="Lead status"
      onChange={(e) => {
        const next = e.target.value;
        if (next === status) return;
        startTransition(async () => {
          const fd = new FormData();
          fd.set("id", id);
          fd.set("status", next);
          await setLeadStatus(fd);
          toast(`Status set to ${LABEL[next] ?? next}`, "success");
        });
      }}
      className={`cursor-pointer rounded-md py-1 pl-2 pr-6 text-[11px] font-semibold capitalize outline-none ring-1 transition-opacity focus:ring-2 focus:ring-[#171717]/20 disabled:opacity-50 ${
        STYLE[status] ?? STYLE.closed
      }`}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-[#16181d]">
          {LABEL[s] ?? s}
        </option>
      ))}
    </select>
  );
}
