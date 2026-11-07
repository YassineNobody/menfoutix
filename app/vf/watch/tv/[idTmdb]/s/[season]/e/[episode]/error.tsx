"use client";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return <div role="alert" className="fixed inset-0 z-[12000] flex h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white"><p>Impossible de charger cet épisode.</p><button onClick={retry} className="min-h-11 rounded-lg bg-red-600 px-5 hover:bg-red-700">Réessayer</button><a href="/vf/tv-shows" className="text-sm text-zinc-400 hover:text-white">Retour aux séries</a></div>;
}
