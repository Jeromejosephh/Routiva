import AutoClear from "./AutoClear";
import EmailForm from "./EmailForm";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routiva - Simple Habit Tracker",
  description: "Transform your daily routines with Routiva - a completely FREE habit tracking app. Build consistent habits, track progress, and achieve your goals with beautiful analytics.",
  alternates: {
    canonical: '/sign-in',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Routiva - Simple Habit Tracker",
    description: "Free habit tracking app with beautiful analytics. Start building better daily routines today.",
  },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <AutoClear />
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <Image 
              src="/Routivalogo.png" 
              alt="Routiva Logo" 
              width={64}
              height={64}
              className="rounded-[8px] shadow-lg"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Welcome to Routiva
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in or create account to start building better habits
          </p>
        </div>

        {/* Sign-in Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get Started
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We&apos;ll send you a secure link to sign in
              </p>
            </div>
            
            <EmailForm />
            
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trouble signing in?{" "}
                <a 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors" 
                  href="/auth/clear?redirect=/sign-in"
                >
                  Reset sign-in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
