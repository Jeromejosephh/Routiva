"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    await signIn("email", { email, callbackUrl: "/" });
    alert("Check your email (or terminal for Ethereal preview link).");
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
        <button className="w-full rounded bg-black text-white py-2">
          Email me a link
        </button>
      </form>
    </main>
  );
}
