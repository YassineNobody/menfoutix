import type { CatalogueVersion } from "@/lib/catalogue";
import { getSeries } from "@/lib/services/series";
import { HorizontalCarousel } from "../Carousel/HorizontalCarousel";
import { MovieCard } from "../Movie/MovieCard";

export async function RecentlyAddedCarouselSeries({ version = "VO" }: { version?: CatalogueVersion }) {
  const { data } = getSeries("recentlyAdded", 1, 20, {}, version);
  return (
    <HorizontalCarousel title="Les derniers ajouts">
      {data.map((p, index) => (
        <MovieCard key={index} movie={{ ...p, titleFr: p.displayTitle }} />
      ))}
    </HorizontalCarousel>
  );
}
