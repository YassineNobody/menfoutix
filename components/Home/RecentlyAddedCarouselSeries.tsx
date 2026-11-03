import { getSeries } from "@/lib/services/series";
import { HorizontalCarousel } from "../Carousel/HorizontalCarousel";
import { MovieCard } from "../Movie/MovieCard";

export async function RecentlyAddedCarouselSeries() {
  const { data } = getSeries("recentlyAdded", 1, 20);
  return (
    <HorizontalCarousel title="Les derniers ajouts">
      {data.map((p, index) => (
        <MovieCard key={index} movie={{ ...p, titleFr: p.displayTitle }} />
      ))}
    </HorizontalCarousel>
  );
}
