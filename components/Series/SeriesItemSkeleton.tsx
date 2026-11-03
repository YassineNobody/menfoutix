export function SeriesItemSkeleton() {
  return (
    <div role="status" aria-label="Loading series" className="relative min-h-screen bg-black px-4 pb-10 pt-28 md:px-8 lg:px-16">
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-8 h-9 w-3/4 max-w-lg rounded bg-zinc-800" />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="aspect-2/3 w-full shrink-0 rounded-lg bg-zinc-900 lg:w-106" />
          <div className="w-full space-y-5">
            <div className="h-10 w-48 rounded bg-zinc-800" />
            <div className="h-5 w-32 rounded bg-zinc-800" />
            <div className="h-3 w-full rounded bg-zinc-900" />
            <div className="h-3 w-5/6 rounded bg-zinc-900" />
            <div className="h-3 w-3/4 rounded bg-zinc-900" />
            <div className="h-16 max-w-sm rounded bg-zinc-900" />
          </div>
        </div>
        <div className="mt-12 h-7 w-52 rounded bg-zinc-800" />
        <div className="mt-5 flex gap-3">{[0,1,2].map((i) => <div key={i} className="h-20 w-36 rounded-xl bg-zinc-900" />)}</div>
      </div>
      <span className="sr-only">Loading series information…</span>
    </div>
  );
}
