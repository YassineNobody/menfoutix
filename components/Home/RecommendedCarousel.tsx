import { getRecommandationTmdbRating } from "@/lib/services/recommandation";
import { HeroCarousel } from "../Carousel/HeroCarousel";

export async function RecommendedCarouselHome() {
  const { data } = getRecommandationTmdbRating(1, 7);
  return (
    <HeroCarousel movies={data} />
  );
}
