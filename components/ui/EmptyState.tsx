// components/ui/EmptyState.tsx
"use client";

import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "danger" | "success";
  className?: string;
}

const VARIANT = {
  default: "from-cyan-50 via-white to-blue-50 border-cyan-100",
  danger: "from-rose-50 via-white to-amber-50 border-rose-100",
  success: "from-emerald-50 via-white to-cyan-50 border-emerald-100",
};

export function EmptyState({ icon, title, description, action, variant = "default", className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-3xl bg-gradient-to-br ${VARIANT[variant]} border p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-lg ${className}`}
    >
      {icon && (
        <div className="text-5xl mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 border border-white/70 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-600 mb-5 max-w-2xl mx-auto">{description}</p>}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;