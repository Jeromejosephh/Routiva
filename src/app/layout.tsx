// src/app/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'Routiva | Transform Your Routine',
    template: '%s | Routiva'
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
  twitter: {
    card: 'summary_large_image',
    title: 'Routiva - Simple Habit Tracking App',
    description: 'Transform your daily routines with Routiva - a simple, effective habit tracking app. Build consistent habits and achieve your goals.',
    images: ['/Routivalogo.png?v=4'],
    creator: '@routiva',
    site: '@routiva',
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
