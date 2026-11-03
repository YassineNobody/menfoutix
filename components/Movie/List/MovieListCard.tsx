import Link from "next/link";
import { Star } from "lucide-react";

import type { WorkListItemResponse } from "@/types/work/work";

export function MovieListCard({ movie }: { movie: WorkListItemResponse }) {
  const title =
    movie.displayTitle || movie.titleEn || movie.originalTitle || movie.titleFr || "Untitled";

  return (
    <Link
      href={`/${movie.type === "série" ? "tv" : "movie"}/${movie.tmdbId}`}
      className="group flex gap-4 rounded-xl border border-white/10 bg-zinc-950/80 p-3 transition-colors hover:border-white/25 hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-5"
    >
      <div className="aspect-2/3 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-900 sm:w-28">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 py-1">
        <h2 className="line-clamp-2 text-base font-semibold text-white group-hover:text-red-300 sm:text-lg">
          {title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          {movie.releaseDate && <span>{movie.releaseDate.slice(0, 4)}</span>}

          {movie.tmdbRating != null && (
            <span className="inline-flex items-center gap-1 text-amber-300">
              <Star size={13} fill="currentColor" aria-hidden="true" />
              {movie.tmdbRating.toFixed(1)}/10
            </span>
          )}
        </div>

        {movie.synopsis && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-400 sm:line-clamp-3 sm:text-sm">
            {movie.synopsis}
          </p>
        )}
      </div>
    </Link>
  );
}
