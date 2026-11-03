export default function Loading() {
  return <div role="status" aria-label="Loading search" className="min-h-screen bg-black px-4 pb-20 pt-28 sm:px-6 lg:px-16">
    <div aria-hidden="true" className="motion-safe:animate-pulse"><div className="mx-auto mb-8 h-10 w-3/4 max-w-lg rounded bg-zinc-800" /><div className="mx-auto mb-12 h-14 max-w-3xl rounded-2xl bg-zinc-900" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({length:10},(_,i)=><div key={i} className="aspect-2/3 rounded-xl bg-zinc-900" />)}</div>
    </div><span className="sr-only">Loading search results…</span>
  </div>;
}
