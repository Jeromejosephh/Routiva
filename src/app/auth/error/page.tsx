"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Log the error in development
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Auth error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
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
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {error === "AccessDenied" && "You don't have access to this resource."}
            {error === "Verification" && 
              "The sign-in link is no longer valid. It may have expired or already been used."}
            {!error && "An unknown error occurred during authentication."}
          </p>
        </div>

        {/* Error Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Try Again
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You can return to sign in and try again.
              </p>
            </div>
            <div className="text-center">
              <Link
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If you continue to have trouble, contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
