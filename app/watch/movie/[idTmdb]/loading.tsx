export default function Loading() {
  return (
    <div role="status" aria-label="Chargement du lecteur" className="fixed inset-0 z-[12000] flex items-center justify-center bg-black">
      <div aria-hidden="true" className="h-10 w-10 rounded-full border-2 border-white/10 border-t-red-500 motion-safe:animate-spin" />
    </div>
  );
}
