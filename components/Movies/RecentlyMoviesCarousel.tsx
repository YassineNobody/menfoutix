import type { CatalogueVersion } from "@/lib/catalogue";
import { getRecentMoviesByRating } from "@/lib/services/recommandation";
import { HorizontalCarousel } from "../Carousel/HorizontalCarousel";
import { MovieCard } from "../Movie/MovieCard";

export const RecentlyMoviesCarousel = ({ version = "VO" }: { version?: CatalogueVersion }) => {
  const { data } = getRecentMoviesByRating(1, 20, version);
  return (
    <HorizontalCarousel title="Tendances du jour">
      {data.map((p, index) => (
        <MovieCard key={index} movie={{ ...p, titleFr: p.displayTitle }} />
      ))}
    </HorizontalCarousel>
  );
};
