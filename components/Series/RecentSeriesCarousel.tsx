import { getRecentSeriesByRating } from "@/lib/services/recommandation";
import { HorizontalCarousel } from "@/components/Carousel/HorizontalCarousel";
import { MovieCard } from "@/components/Movie/MovieCard";

export function RecentSeriesCarousel() {
  const { data } = getRecentSeriesByRating(1, 20);
  return (
    <HorizontalCarousel title="Recent series">
      {data.map((series) => (
        <MovieCard key={series.tmdbId} movie={{ ...series, titleFr: series.displayTitle }} />
      ))}
    </HorizontalCarousel>
  );
}
