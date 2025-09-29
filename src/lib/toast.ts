// src/lib/toast.ts
export function toast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("toast", { detail: message }));
  }
}
