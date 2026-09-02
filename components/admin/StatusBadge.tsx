const styles: Record<string, string> = {
  new: "bg-[#e8efff] text-[#1d4ed8]",
  contacted: "bg-[#fef1e0] text-[#b45309]",
  qualified: "bg-[#e4f6ec] text-[#047857]",
  closed: "bg-[#eef0f3] text-[#5b6270]",
};

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold capitalize ${
        styles[status] ?? styles.closed
      }`}
    >
      {status}
    </span>
  );
}

export function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold ${
        published
          ? "bg-[#e4f6ec] text-[#047857]"
          : "bg-[#eef0f3] text-[#5b6270]"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
