"use client";
export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return <div role="alert" className="min-h-[60vh] bg-black px-6 pt-28 text-center text-zinc-300"><p>Unable to load search results.</p><button type="button" onClick={() => retry()} className="mt-4 rounded-lg bg-red-600 px-4 py-3 text-white">Try again</button></div>;
}
