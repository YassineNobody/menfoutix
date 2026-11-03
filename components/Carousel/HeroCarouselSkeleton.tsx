import "./HeroCarousel.css";

export const HeroCarouselSkeleton = () => (
  <div
    className="px-6 lg:px-20 min-h-[340px] sm:min-h-[400px] md:min-h-[480px]"
    role="status"
    aria-label="Chargement des films à la une"
  >
    <div className="hero-carousel-frame relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:rounded-3xl motion-safe:animate-pulse">
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-800/60 to-zinc-900" />
      <div className="absolute bottom-20 left-5 right-5 space-y-3 sm:left-8 lg:left-12">
        <div className="flex gap-2">
          <div className="h-6 w-14 rounded-full bg-zinc-700" />
          <div className="h-6 w-16 rounded-full bg-zinc-700" />
          <div className="h-6 w-14 rounded-full bg-zinc-700" />
        </div>
        <div className="h-16 w-48 rounded-lg bg-zinc-700 sm:w-72" />
        <div className="h-3 max-w-lg rounded bg-zinc-700/80" />
        <div className="h-3 max-w-sm rounded bg-zinc-700/80" />
        <div className="h-9 w-40 rounded-xl bg-zinc-700" />
      </div>
      <div className="absolute bottom-3 left-1/2 h-10 w-56 -translate-x-1/2 rounded-full bg-zinc-800/90" />
    </div>
    <span className="sr-only">Chargement des films à la une…</span>
  </div>
);
