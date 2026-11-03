import type { MovieResponse } from "@/types/movies/movies";
import { DetailOverview } from "@/components/Details/DetailInformation";

export function MovieOverview({ movie }: { movie: MovieResponse }) {
  return <DetailOverview synopsis={movie.synopsis} rating={movie.tmdbVoteAverage}
    certification={movie.certificationFr} runtimeMinutes={movie.runtimeMinutes}
    peopleLabel={movie.directors.length > 1 ? "Directors" : "Director"}
    people={movie.directors.map((item) => item.name)} genres={movie.genres} />;
}
