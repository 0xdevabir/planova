// components/ToastProvider.tsx
"use client";

import type { ReactNode } from "react";
import { useToastController, ToastContext } from "@/hooks/useToast";
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from "react-icons/fa";

const ICON_BY_TONE = {
  info: <FaInfoCircle />,
  success: <FaCheckCircle />,
  warning: <FaExclamationTriangle />,
  danger: <FaTimesCircle />,
};

const TONE_CLASSES = {
  info: "bg-cyan-50 border-cyan-200 text-cyan-800",
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  danger: "bg-rose-50 border-rose-200 text-rose-800",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const controller = useToastController();
  return (
    <ToastContext.Provider value={controller}>
      {children}
      <div className="fixed top-24 right-4 z-[60] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]">
        {controller.toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-2 rounded-2xl border px-4 py-3 shadow-lg ${TONE_CLASSES[toast.tone]} animate-[fade-rise_320ms_ease]`}
          >
            <span className="text-lg mt-0.5">{ICON_BY_TONE[toast.tone]}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{toast.title}</p>
              {toast.description && <p className="text-xs opacity-80 mt-0.5">{toast.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => controller.dismiss(toast.id)}
              className="text-current/60 hover:text-current"
              aria-label="Dismiss"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;