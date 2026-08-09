// hooks/useToast.ts
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  durationMs: number;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id" | "durationMs"> & { durationMs?: number }) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastController(): ToastContextValue {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback<ToastContextValue["push"]>(
    (incoming) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const durationMs = incoming.durationMs ?? 3200;
      const next: Toast = { id, durationMs, ...incoming };
      setToasts((prev) => [...prev, next]);
      if (typeof window !== "undefined") {
        window.setTimeout(() => dismiss(id), durationMs);
      }
    },
    [dismiss],
  );

  return useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);
}

export function useToast(): ToastContextValue["push"] {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return () => undefined;
  }
  return ctx.push;
}