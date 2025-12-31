"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    // Sign out after page loads
    const timer = setTimeout(() => {
      signOut({ redirect: false }).then(() => {
        // Redirect to home after sign out
        window.location.href = "/";
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 text-white"
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
            Signed Out Successfully
          </h1>
          <p className="text-white mt-2">
            You have been securely signed out of Routiva
          </p>
        </div>

        {/* Sign-out Card */}
        <div
          className="bg-black border border-gray-700 rounded-2xl shadow-xl p-8"
          style={{ color: "#ffffff" }}
        >
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Come Back Soon!
              </h2>
              <p className="text-white text-sm">
                Thank you for using Routiva to build better habits
              </p>
            </div>
            
            <div className="text-center">
              <Link
                href="/sign-in"
                className="inline-block px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
              >
                Sign In Again
              </Link>
              <div className="mt-3">
                <Link
                  href="/"
                  className="inline-block px-8 py-3 rounded-lg border border-gray-600 text-white font-semibold hover:bg-gray-900 transition"
                >
                  Go Back
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-white">
            Redirecting in a moment...
          </p>
        </div>
      </div>
    </div>
  );
}
