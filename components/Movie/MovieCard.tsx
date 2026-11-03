"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Film, Star } from "lucide-react";
import type { WorkListItemResponse } from "@/types/work/work";

interface Props {
  movie: WorkListItemResponse;
  variant?: "carousel" | "grid";
}

export function MovieCard({ movie, variant = "carousel" }: Props) {
  const title = movie.titleFr || movie.localTitle || movie.originalTitle || "Sans titre";
  const rating = movie.tmdbRating != null && Number.isFinite(movie.tmdbRating)
    ? `${movie.tmdbRating.toFixed(1)}/10` : null;

  return (
    <Link
      href={`/${movie.type === "série" ? "tv" : "movie"}/${movie.tmdbId}`}
      aria-label={`${title} — ${movie.type === "série" ? "série" : "film"}`}
      className={`group relative block aspect-2/3  w-[144px] md:w-[192px] overflow-hidden border border-white/10 bg-zinc-900 text-left shadow-black/50 transition duration-200 hover:-translate-y-1 hover:border-white/25 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none ${variant === "grid" ? "rounded-xl" : "rounded-lg"}`}
    >
      <Poster key={movie.posterUrl || "missing"} src={movie.posterUrl} />

      <span className="pointer-events-none absolute left-2 top-2 z-10 rounded border border-white/20 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        {movie.type === "série" ? "Série" : "Film"}
      </span>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black via-black/85 to-transparent p-3 opacity-100 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 motion-reduce:transition-none">
        <CardTitle key={movie.logoUrl || "text"} title={title} src={movie.logoUrl} />

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-200">
          {rating && (
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="fill-current text-amber-400" aria-hidden="true" />
              {rating}
            </span>
          )}
          {movie.releaseDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} aria-hidden="true" />
              {movie.releaseDate.slice(0, 4)}
            </span>
          )}
        </div>

        {movie.synopsis && (
          <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-zinc-300">
            {movie.synopsis}
          </p>
        )}
      </div>
    </Link>
  );
}

function Poster({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-xs text-zinc-500">
        <Film size={30} aria-hidden="true" />
        Aucune affiche
      </div>
    );
  }
  return (
    // Les images distantes restent des img, comme dans HeroCarousel.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" decoding="async" draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
  );
}

function CardTitle({ title, src }: { title: string; src: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <h3 className="text-sm font-semibold leading-snug text-white">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={title} loading="lazy" decoding="async" draggable={false}
          onError={() => setFailed(true)}
          className="max-h-16 w-auto max-w-full object-contain object-left drop-shadow-lg" />
      ) : <span className="line-clamp-2">{title}</span>}
    </h3>
  );
}
