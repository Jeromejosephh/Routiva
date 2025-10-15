
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routiva | Transform Your Routine",
  description:
    "Transform your daily routines with Routiva - a simple, effective habit tracking app that is completely FREE. Build consistent habits, track your progress, and achieve your goals with beautiful analytics and insights.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Routiva - Simple Habit Tracking App",
    description:
      "Transform your daily routines with Routiva - a simple, effective habit tracking app. Build consistent habits, track your progress, and achieve your goals.",
    url: "https://routiva.app",
    siteName: "Routiva",
    images: [
      {
        url: "/Routivalogo.png?v=5",
        width: 1200,
        height: 630,
        alt: "Routiva - Habit Tracking App",
        type: "image/png",
      },
    ],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-6">
          <Image src="/Routivalogo.png" alt="Routiva Logo" width={80} height={80} className="rounded-xl shadow-lg" priority />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900 dark:text-white">Transform Your Routine with Routiva</h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8">
          Routiva is a simple, effective habit tracking app that helps you build consistent habits, track your progress, and achieve your goals. 100% FREE, privacy-first, and beautifully designed.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <Link href="/sign-in" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Get Started</Link>
          <Link href="/dashboard" className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-white font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition">Demo Dashboard</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
            <h2 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">Track Habits</h2>
            <p className="text-gray-600 dark:text-gray-300">Easily add, organize, and manage your daily habits. Stay consistent and motivated.</p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
            <h2 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">Beautiful Analytics</h2>
            <p className="text-gray-600 dark:text-gray-300">Visualize your progress with streaks, heatmaps, and completion rates. Celebrate your wins!</p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow">
            <h2 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">Privacy-First</h2>
            <p className="text-gray-600 dark:text-gray-300">Your data is secure and never sold. Routiva is free, with no ads or tracking.</p>
          </div>
        </div>
        <div className="mb-8">
          <Image src="/bg-desktop-light.png" alt="App Screenshot" width={600} height={338} className="rounded-xl shadow-lg mx-auto" />
        </div>
        <p className="text-md text-gray-500 dark:text-gray-400">Ready to build better habits? <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 underline">Sign up now</Link> and start your journey!</p>
      </div>
    </main>
  );
}