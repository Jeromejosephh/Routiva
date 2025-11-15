// src/components/Toaster.tsx
"use client";

import { useEffect, useState } from "react";
import type React from "react";
import type { ToastOptions, ToastVariant } from "@/lib/toast";

type Item = {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
};

const variantStyles: Record<ToastVariant, string> = {
  info: "border-zinc-700 bg-black/85 text-white",
  success: "border-emerald-600 bg-emerald-600/15 text-emerald-200",
  error: "border-red-600 bg-red-600/15 text-red-200",
  warning: "border-amber-500 bg-amber-500/15 text-amber-200",
};

const variantIcon: Record<ToastVariant, React.ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M12 8h.01M11 12h1v5h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M12 9v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
};

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let nextId = 0;
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastOptions>).detail;
      if (!detail) return;
      const id = ++nextId;
      const item: Item = {
        id,
        message: detail.message,
        variant: detail.variant ?? "info",
        duration: detail.duration ?? 3000,
      };
      setItems((p) => [...p, item]);
      window.setTimeout(
        () => setItems((p) => p.filter((x) => x.id !== id)),
        item.duration
      );
    };
    window.addEventListener("toast", onToast as EventListener);
    return () => window.removeEventListener("toast", onToast as EventListener);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {items.map((it) => (
        <div
          key={it.id}
          className={`pointer-events-auto rounded border px-3 py-2 text-sm shadow-md backdrop-blur-sm transition-all duration-300 ease-out translate-y-0 opacity-100 ${variantStyles[it.variant]}`}
          role="status"
        >
          <div className="flex items-center gap-2">
            {variantIcon[it.variant]}
            <span>{it.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
