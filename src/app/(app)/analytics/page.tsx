// src/app/(app)/analytics/page.tsx
import { requireUser } from "@/lib/auth-helpers";

export default async function AnalyticsPage() {
  await requireUser();
  return <h1 className="text-2xl font-semibold">Analytics</h1>;
}
