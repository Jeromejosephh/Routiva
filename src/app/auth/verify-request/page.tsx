"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function VerifyRequestPage() {
  // Clear any stale auth state
  useEffect(() => {
    void fetch("/auth/clear?redirect=__noop", {
      credentials: "include",
      cache: "no-store",
    });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        backgroundImage: 'url(/Routivabg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: "#ffffff"
      }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="rounded-2xl shadow-xl p-8 backdrop-blur-md border border-white/20" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            A sign in link has been sent to your email address.
          </p>
          <p className="text-sm text-white/70 mt-4 text-center">
            The link will expire in 10 minutes.
          </p>
          <p className="mt-4 text-center text-sm">
            <Link
              href="/sign-in"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}