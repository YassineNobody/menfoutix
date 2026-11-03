export default function Loading() {
  return (
    <div role="status" aria-label="Loading series" className="min-h-screen bg-black px-4 pb-16 pt-28 sm:px-6 lg:px-16">
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-8 h-9 w-48 rounded bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-2/3 rounded-xl bg-zinc-900" />)}
        </div>
      </div>
      <span className="sr-only">Loading series…</span>
    </div>
  );
}
