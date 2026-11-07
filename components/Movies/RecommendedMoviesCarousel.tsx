import type { CatalogueVersion } from "@/lib/catalogue";
import { getMovieRecommendationsTmdbRating } from "@/lib/services/recommandation";
import { HeroCarousel } from "../Carousel/HeroCarousel";
export const RecommendedMoviesCarousel = ({ version = "VO" }: { version?: CatalogueVersion }) => {
  const { data } = getMovieRecommendationsTmdbRating(1, 7, version);
  return <HeroCarousel movies={data} />;
};
