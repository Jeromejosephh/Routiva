// src/components/Toaster.tsx
"use client";

import { useEffect, useState } from "react";

type Item = { id: number; text: string };

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let nextId = 0;
    const onToast = (e: Event) => {
      const text = String((e as CustomEvent).detail ?? "");
      const id = ++nextId;
      setItems((p) => [...p, { id, text }]);
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 3000);
    };
    window.addEventListener("toast", onToast as EventListener);
    return () => window.removeEventListener("toast", onToast as EventListener);
  }, []);

  return (
    <div className="fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {items.map((it) => (
        <div
          key={it.id}
          className="pointer-events-auto rounded border border-zinc-700 bg-black/80 px-3 py-2 text-sm text-white shadow-md"
        >
          {it.text}
        </div>
      ))}
    </div>
  );
}
