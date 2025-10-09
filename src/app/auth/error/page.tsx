
"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            {error === "AccessDenied" && "You don't have access to this resource."}
            {error === "Verification" && 
              "The sign-in link is no longer valid. It may have expired or already been used."}
            {!error && "An unknown error occurred during authentication."}
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Try signing in again
          </Link>
        </div>
      </div>
    </div>
  );
}
