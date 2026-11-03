"use client";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return <div role="alert" className="fixed inset-0 z-[12000] flex h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white"><p>Unable to load this episode.</p><button onClick={retry} className="min-h-11 rounded-lg bg-red-600 px-5 hover:bg-red-700">Try again</button><a href="/tv-shows" className="text-sm text-zinc-400 hover:text-white">Back to series</a></div>;
}
