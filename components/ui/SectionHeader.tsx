// components/ui/SectionHeader.tsx
"use client";

import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 font-semibold">{eyebrow}</p>
      )}
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">{title}</h2>
      {description && <p className="text-slate-600 max-w-2xl text-base">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export default SectionHeader;