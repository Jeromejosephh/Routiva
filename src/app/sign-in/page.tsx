import AutoClear from "./AutoClear";
import EmailForm from "./EmailForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Routiva to start tracking your habits and building better daily routines. Secure magic link authentication.",
  openGraph: {
    title: "Sign In | Routiva",
    description: "Access your habit tracking dashboard with secure sign-in.",
  },
};

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <AutoClear />
      <h1 className="text-2xl font-semibold">Sign in to Routiva</h1>
      <EmailForm />
      <p className="text-sm text-muted-foreground">
        Trouble signing in?{" "}
        <a className="underline" href="/auth/clear?redirect=/sign-in">
          Reset sign-in
        </a>
      </p>
    </main>
  );
}
