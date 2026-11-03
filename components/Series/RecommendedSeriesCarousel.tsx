import { getSeries } from "@/lib/services/series";
import { HeroCarousel } from "@/components/Carousel/HeroCarousel";

export function RecommendedSeriesCarousel() {
  const { data } = getSeries("tmdbRating", 1, 7);
  return <HeroCarousel movies={data} />;
}
