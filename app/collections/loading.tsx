export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement des collections"
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-6"
    >
      <div
        aria-hidden="true"
        className="h-10 w-10 rounded-full border-2 border-white/10 border-t-red-500 motion-safe:animate-spin"
      />

      <p className="text-sm text-zinc-400 motion-safe:animate-pulse">
        Chargement des collections…
      </p>
    </div>
  );
}
