// src/app/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'Routiva - Simple Habit Tracking App',
    template: '%s | Routiva'
  },
  description: "Transform your daily routines with Routiva - a simple, effective habit tracking app. Build consistent habits, track your progress, and achieve your goals with beautiful analytics and insights.",
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
        url: '/Routivalogo.png',
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
    images: ['/Routivalogo.png'],
    creator: '@routiva',
    site: '@routiva',
  },
  verification: {
    google: 'your-google-verification-code',
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
