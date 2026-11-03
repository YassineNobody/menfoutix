export default function Loading() {
  return <div role="status" className="fixed inset-0 z-[12000] flex h-dvh flex-col items-center justify-center gap-4 bg-black text-zinc-400"><span aria-hidden="true" className="size-10 rounded-full border-2 border-zinc-800 border-t-red-600 motion-safe:animate-spin" /><p>Loading episode…</p></div>;
}
