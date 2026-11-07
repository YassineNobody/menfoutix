import type { CatalogueVersion } from "@/lib/catalogue";
import { getSeries } from "@/lib/services/series";
import { HeroCarousel } from "@/components/Carousel/HeroCarousel";

export function RecommendedSeriesCarousel({ version = "VO" }: { version?: CatalogueVersion }) {
  const { data } = getSeries("tmdbRating", 1, 7, {}, version);
  return <HeroCarousel movies={data} />;
}
