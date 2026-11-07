import type { CatalogueVersion } from "@/lib/catalogue";
import Link from "@/components/Catalogue/CatalogueLink";

import { getGenres } from "@/lib/services/genre";
import type { WorkType } from "@/types/work/work";
import { HorizontalCarousel } from "../Carousel/HorizontalCarousel";

interface Props {
  workType?: WorkType;
  version?: CatalogueVersion;
}

export function GenresCarousel({
  workType = "film",
  version = "VO",
}: Props) {
  const genres = getGenres(workType, version);
  const routeType = workType === "film" ? "movie" : "tv";

  return (
    <HorizontalCarousel title="Trouve ton contenu par genre">
      {genres.map((genre) => {
        if (genre.id === null) return null;

        return (
          <Link
            key={genre.id}
            href={`/genre/${routeType}/${genre.id}`}
            aria-label={`Voir le genre ${genre.name}`}
            className="group relative block h-[100px] w-[180px] flex-none select-none overflow-hidden rounded-xl border border-white/10 bg-zinc-900 text-center transition hover:border-white/30 focus-visible:outline-2 focus-visible:outline-red-500 md:h-[120px] md:w-[220px]"
          >
            {genre.backdropUrl && (
              <img
                src={genre.backdropUrl}
                alt=""
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            <span
              aria-hidden="true"
              className="absolute inset-0 bg-black/55 transition-colors group-hover:bg-black/40"
            />

            <span className="relative z-10 flex h-full items-center justify-center px-3 font-montserrat text-sm font-semibold text-white drop-shadow-md md:text-base">
              {genre.name}
            </span>
          </Link>
        );
      })}
    </HorizontalCarousel>
  );
}
