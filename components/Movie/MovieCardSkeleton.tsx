export function MovieCardSkeleton() {
  return (
    <div aria-hidden="true" className="relative aspect-2/3 w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900 motion-safe:animate-pulse">
      <div className="absolute left-2 top-2 h-5 w-12 rounded bg-zinc-700" />
      <div className="absolute inset-x-3 bottom-4 space-y-3">
        <div className="h-10 w-4/5 rounded bg-zinc-700" />
        <div className="h-3 w-2/3 rounded bg-zinc-800" />
        <div className="h-2 w-full rounded bg-zinc-800" />
        <div className="h-2 w-4/5 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
