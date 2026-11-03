import { WorkListItemResponse } from "@/types/work/work";
import { MovieCard } from "../MovieCard";

interface Props {
  movie: WorkListItemResponse;
}

export function MovieGridCard({ movie }: Props) {
  return <MovieCard movie={{ ...movie, titleFr: movie.displayTitle }} variant="grid" />;
}
