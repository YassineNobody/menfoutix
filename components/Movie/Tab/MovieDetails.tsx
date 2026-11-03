import type { MovieResponse } from "@/types/movies/movies";
import { DetailFacts } from "@/components/Details/DetailInformation";

export function MovieDetails({ movie }: { movie: MovieResponse }) {
  return <DetailFacts originalTitle={movie.originalTitle} releaseDate={movie.releaseDate}
    releaseLabel="Release date" certification={movie.certificationFr} runtimeMinutes={movie.runtimeMinutes}
    companies={movie.productionCompanies.map((item) => item.name)} rating={movie.tmdbVoteAverage}
    voteCount={movie.tmdbVoteCount} peopleLabel={movie.directors.length > 1 ? "Directors" : "Director"}
    people={movie.directors.map((item) => item.name)} actors={movie.actors} />;
}
