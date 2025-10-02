"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await signIn("email", { 
        email, 
        callbackUrl: "/",
        redirect: false 
      });
      
      if (result?.error) {
        console.error("Sign in error:", result.error);
        alert("Failed to send email. Please try again.");
      } else {
        alert("Check your email.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in to Routiva</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border p-2"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Email me a link"}
        </button>
      </form>
    </main>
  );
}
