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
    canonical: 'https://routiva.app',
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
        url: '/Routivalogo.png?v=4',
        width: 1200,
        height: 630,
        alt: 'Routiva - Habit Tracking App',
        type: 'image/png',
      }
    ],
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico?v=4', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon_io/favicon-16x16.png?v=4', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png?v=4', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon_io/android-chrome-192x192.png?v=4', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicon_io/android-chrome-512x512.png?v=4', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen">
        {/* Background images for light/dark and desktop/mobile */}
        <div className="fixed inset-0 -z-10">
          {/* Desktop backgrounds */}
          <img
            src="/bg-desktop-light.png"
            alt="Desktop Light Background"
            className="hidden dark:hidden md:block w-full h-full object-cover"
          />
          <img
            src="/bg-desktop-dark.png"
            alt="Desktop Dark Background"
            className="hidden dark:md:block w-full h-full object-cover"
          />
          {/* Mobile backgrounds */}
          <img
            src="/bg-mobile-light.png"
            alt="Mobile Light Background"
            className="block dark:hidden md:hidden w-full h-full object-cover"
          />
          <img
            src="/bg-mobile-dark.png"
            alt="Mobile Dark Background"
            className="hidden dark:block md:hidden w-full h-full object-cover"
          />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
