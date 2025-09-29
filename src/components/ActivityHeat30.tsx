export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ActivityHeat30({ userId }: { userId: string }) {
  return (
    <div className="mt-6 rounded border p-4 bg-amber-500/10">
      <h2 className="text-lg font-semibold">DEBUG: Heatmap placeholder</h2>
      <p className="text-sm">Rendered at: {new Date().toISOString()}</p>
      <p className="text-xs opacity-70">userId: {userId}</p>
    </div>
  );
}
