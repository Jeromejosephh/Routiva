import AutoClear from "./AutoClear";
import EmailForm from "./EmailForm";

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
