import type { CatalogueVersion } from "@/lib/catalogue";
import { getMovies } from "@/lib/services/movies";
import { HorizontalCarousel } from "../Carousel/HorizontalCarousel";
import { MovieCard } from "../Movie/MovieCard";
import { Clock } from "lucide-react";

export async function RecentlyAddedCarouselMovies({ version = "VO" }: { version?: CatalogueVersion }) {
  const { data } = getMovies("recentlyAdded", 1, 20, version);
  return (
    <HorizontalCarousel title="Les derniers ajouts de film" icon={<Clock />}>
      {data.map((p, index) => (
        <MovieCard key={index} movie={{ ...p, titleFr: p.displayTitle }} />
      ))}
    </HorizontalCarousel>
  );
}
