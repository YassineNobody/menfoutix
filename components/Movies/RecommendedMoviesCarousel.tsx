import { getMovieRecommendationsTmdbRating } from "@/lib/services/recommandation";
import { HeroCarousel } from "../Carousel/HeroCarousel";
export const RecommendedMoviesCarousel = () => {
  const { data } = getMovieRecommendationsTmdbRating(1, 7);
  return <HeroCarousel movies={data} />;
};
