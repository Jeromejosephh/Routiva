// src/app/page.tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Routiva | Transform Your Routine',
  description: "Transform your daily routines with Routiva - a simple, effective habit tracking app that is completely FREE. Build consistent habits, track your progress, and achieve your goals.",
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  redirect("/dashboard");
}