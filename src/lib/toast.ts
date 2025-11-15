// src/lib/toast.ts
export type ToastVariant = "info" | "success" | "error" | "warning";
export type ToastOptions = {
  message: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

/**
 * Show a toast. Backwards-compatible with toast("message").
 */
export function toast(messageOrOptions: string | ToastOptions) {
  if (typeof window === "undefined") return;

  const detail: ToastOptions =
    typeof messageOrOptions === "string"
      ? { message: messageOrOptions, variant: "info", duration: 3000 }
      : {
          message: messageOrOptions.message,
          variant: messageOrOptions.variant ?? "info",
          duration: messageOrOptions.duration ?? 3000,
        };

  window.dispatchEvent(new CustomEvent("toast", { detail }));
}
