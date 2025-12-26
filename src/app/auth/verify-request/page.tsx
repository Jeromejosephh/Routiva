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
    <div className="min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            A sign in link has been sent to your email address.
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-white/70">
            The link will expire in 10 minutes.
          </p>
          <p className="mt-4 text-sm">
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