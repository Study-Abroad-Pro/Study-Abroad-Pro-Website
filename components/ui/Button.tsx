import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const base =
  "group inline-flex items-center gap-2.5 rounded-full text-[0.9375rem] font-semibold " +
  "transition-[background-color,color,box-shadow,transform] duration-300 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white px-7 py-3.5 shadow-[0_12px_30px_-12px_rgba(255,50,13,0.75)] " +
    "hover:bg-brand-deep hover:-translate-y-0.5",
  ghost:
    "bg-white/85 text-ink px-7 py-3.5 backdrop-blur-sm ring-1 ring-black/5 " +
    "hover:bg-white hover:-translate-y-0.5",
  outline:
    "text-ink px-6 py-3 ring-1 ring-ink/15 hover:ring-brand hover:text-brand",
};

export function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </Link>
  );
}
