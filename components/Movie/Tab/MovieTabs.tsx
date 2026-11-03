import type { MovieResponse } from "@/types/movies/movies";
import { DetailTabs } from "@/components/Details/DetailTabs";
import { MovieOverview } from "./MovieOverview";
import { MovieDetails } from "./MovieDetails";

export function MovieTabs({ movie }: { movie: MovieResponse }) {
  return <DetailTabs label="Movie information"
    overview={<MovieOverview movie={movie} />} details={<MovieDetails movie={movie} />} />;
}
