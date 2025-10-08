"use client";

import { useEffect } from "react";

export default function AutoClear() {
  useEffect(() => {
    void fetch("/auth/clear?redirect=__noop", {
      credentials: "include",
      cache: "no-store",
    });
  }, []);
  return null;
}
