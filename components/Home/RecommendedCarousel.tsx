import type { CatalogueVersion } from "@/lib/catalogue";
import { getRecommandationTmdbRating } from "@/lib/services/recommandation";
import { HeroCarousel } from "../Carousel/HeroCarousel";

export async function RecommendedCarouselHome({ version = "VO" }: { version?: CatalogueVersion }) {
  const { data } = getRecommandationTmdbRating(1, 7, version);
  return (
    <HeroCarousel movies={data} />
  );
}
