"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/admin/auth";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  superadminOnly?: boolean;
  soon?: boolean;
};

const items: Item[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: <path d="M3 7l9 6 9-6M4 5h16v14H4z" />,
  },
  {
    href: "/admin/countries",
    label: "Countries",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
      </>
    ),
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: <path d="M5 4h11l3 3v13H5zM15 4v4h4M8 12h8M8 16h8" />,
  },
  {
    href: "/admin/forms",
    label: "Forms",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    href: "/admin/settings",
    label: "Site settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      </>
    ),
  },
  {
    href: "/admin/team",
    label: "Admin users",
    superadminOnly: true,
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M4 20c0-3 2.5-5 5-5s5 2 5 5M16 6a3 3 0 0 1 0 6M15 15c2.5 0 5 2 5 5" />
      </>
    ),
  },
  {
    href: "/admin/audit",
    label: "Activity log",
    superadminOnly: true,
    icon: (
      <>
        <path d="M12 8v4l3 2" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  },
];

export default function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items
        .filter((it) => !it.superadminOnly || role === "superadmin")
        .map((it) => {
          const active =
            it.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(it.href);

          const iconSvg = (
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {it.icon}
            </svg>
          );

          if (it.soon) {
            return (
              <span
                key={it.href}
                aria-disabled="true"
                title="Coming soon"
                className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#b6bcc7]"
              >
                {iconSvg}
                {it.label}
                <span className="ml-auto rounded bg-[#eef0f3] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9aa1ae]">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#171717] text-white"
                  : "text-[#5b6270] hover:bg-[#eef0f3] hover:text-[#16181d]"
              }`}
            >
              {iconSvg}
              {it.label}
            </Link>
          );
        })}
    </nav>
  );
}
