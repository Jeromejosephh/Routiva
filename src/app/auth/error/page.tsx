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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundImage: 'url(/Routivabg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: "#ffffff"
      }}
    >
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
            Authentication Error
          </h1>
          <p className="text-white mt-2">
            {error === "AccessDenied" && "You don't have access to this resource."}
            {error === "Verification" && 
              "The sign-in link is no longer valid. It may have expired or already been used."}
            {!error && "An unknown error occurred during authentication."}
          </p>
        </div>

        {/* Error Card */}
        <div
          className="rounded-2xl shadow-xl p-8 backdrop-blur-md border border-white/20"
          style={{ color: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Try Again
              </h2>
              <p className="text-white text-sm">
                You can return to sign in and try again.
              </p>
            </div>
            <div className="text-center">
              <Link
                href="/sign-in"
                className="font-medium text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-white">
            If you continue to have trouble, contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
