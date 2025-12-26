import AutoClear from "./AutoClear";
import EmailForm from "./EmailForm";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Routiva to access your habit tracking dashboard and continue building better daily routines.",
  alternates: {
    canonical: '/',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Sign In | Routiva",
    description: "Access your Routiva habit tracking dashboard.",
  },
};

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 text-white"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
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
          <h1 className="text-3xl font-bold text-white">
            Welcome to Routiva
          </h1>
          <p className="text-white mt-2">
            Sign in or create account to start building better habits
          </p>
        </div>

        {/* Sign-in Card */}
        <div
          className="bg-black border border-gray-700 rounded-2xl shadow-xl p-8"
          style={{ color: "#ffffff" }}
        >
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Get Started
              </h2>
              <p className="text-white text-sm">
                We&apos;ll send you a secure link to sign in
              </p>
            </div>
            
            <EmailForm />
            
            <div className="text-center">
              <p className="text-sm text-white">
                Trouble signing in?{" "}
                <a 
                  className="text-blue-400 hover:text-blue-300 underline transition-colors" 
                  href="/auth/clear?redirect=/sign-in"
                >
                  Reset sign-in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-white">
            By signing in, you agree to our terms and privacy policy
          </p>
          <Link
            href="/"
            className="inline-block text-sm text-blue-400 hover:text-blue-300 underline transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
