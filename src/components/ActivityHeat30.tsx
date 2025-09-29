// src/components/ActivityHeat30.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ActivityHeat30({ userId }: { userId: string }) {
  console.log("[ActivityHeat30] render for", userId, new Date().toISOString());

  return (
    <div className="mt-6 rounded border-2 border-amber-400 p-6 bg-amber-500/20">
      <h2 className="text-2xl font-bold">DEBUG: Heatmap placeholder</h2>
      <p className="text-base mt-2">Rendered at: {new Date().toISOString()}</p>
      <p className="text-sm opacity-80">userId: {userId}</p>
    </div>
  );
}
