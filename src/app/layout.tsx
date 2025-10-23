// src/app/layout.tsx

import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'Routiva | Transform Your Routine',
    template: 'Routiva | %s'
  },
  description: "Transform your daily routines with Routiva - a simple, effective habit tracking app that is completely FREE. Build consistent habits, track your progress, and achieve your goals with beautiful analytics and insights.",
  keywords: ["habit tracker", "productivity", "goals", "routine", "daily habits", "self improvement", "progress tracking"],
  authors: [{ name: "Routiva Team" }],
  creator: "Routiva Team",
  publisher: "Routiva",
  metadataBase: new URL('https://routiva.app'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://routiva.app',
    title: 'Routiva - Simple Habit Tracking App',
    description: 'Transform your daily routines with Routiva - a simple, effective habit tracking app. Build consistent habits, track your progress, and achieve your goals.',
    siteName: 'Routiva',
    images: [
        {
          url: '/RoutivabannerOG.jpg',
          width: 1200,
          height: 630,
          alt: 'Routiva - Habit Tracking App',
          type: 'image/jpeg',
        }
    ],
  },
  icons: {
    icon: [
      { url: '/favicon-48x48.png?v=6', sizes: '48x48', type: 'image/png' },
      { url: '/Routivalogo.png?v=6', sizes: '192x192', type: 'image/png' },
      { url: '/Routivalogo.png?v=6', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/Routivalogo.png?v=6', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [
      { url: '/Routivalogo.png?v=6' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
