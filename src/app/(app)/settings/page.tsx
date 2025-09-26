// src/app/(app)/settings/page.tsx
import { requireUser } from "@/lib/auth-helpers";

export default async function SettingsPage() {
  await requireUser();
  return <h1 className="text-2xl font-semibold">Settings</h1>;
}
