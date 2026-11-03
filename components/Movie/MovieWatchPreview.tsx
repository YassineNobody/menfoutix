import Link from "next/link";
import { Play } from "lucide-react";
import type { MovieResponse } from "@/types/movies/movies";
export function MovieWatchPreview({ movie }: {
    movie: MovieResponse;
}) {
    const video = movie.videos[0];
    if (!video)
        return null;
    const title = movie.titleEn || movie.originalTitle || movie.titleFr;
    const image = movie.backdropUrl || video.thumbnailUrl || movie.posterUrl;
    return (<section className="mt-12 w-full">
      <h2 className="mb-4 text-xl font-semibold text-white">
        {"Watch the movie"}
      </h2>
      <Link href={`/watch/movie/${movie.tmdbId}`} aria-label={`Watch ${title}`} className="group relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500">
        {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"/>)}
        <span aria-hidden="true" className="absolute inset-0 bg-black/45 transition-colors group-hover:bg-black/55"/>
        <span className="relative flex flex-col items-center gap-3 px-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-transform group-hover:scale-110 motion-reduce:transform-none sm:h-20 sm:w-20">
            <Play className="ml-1 h-6 w-6 fill-current sm:h-9 sm:w-9" aria-hidden="true"/>
          </span>
          <span className="line-clamp-2 text-lg font-bold text-white sm:text-2xl">{title}</span>
          <span className="text-xs text-zinc-300 sm:text-sm">
            {"Click to watch the movie"}
          </span>
        </span>
      </Link>
    </section>);
}
