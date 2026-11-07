import { catalogueText, type CatalogueVersion } from "@/lib/catalogue";
import type { MovieResponse } from "@/types/movies/movies";
import { DetailLayout } from "@/components/Details/DetailLayout";
import { MovieWatchPreview } from "./MovieWatchPreview";
import { MovieTabs } from "./Tab/MovieTabs";
import { MovieItemBtnGroup } from "./MovieItemBtnGroup";
import { getYouTubeId } from "@/utils/youtube";
import { TrailerModal } from "../Modal/ModalTrailer";

export function MovieItem({ movie, version = "VO" }: { movie: MovieResponse; version?: CatalogueVersion }) {
  const title = catalogueText(version, movie.titleFr, movie.titleEn, movie.originalTitle || "Untitled");
  const trailerId = movie.trailerUrl ? getYouTubeId(movie.trailerUrl) : null;
  return <DetailLayout title={title} year={movie.releaseYear} posterUrl={movie.posterUrl}
    actions={<><MovieItemBtnGroup movie={movie} />{trailerId && <TrailerModal youtubeId={trailerId} />}</>}
    footer={<MovieWatchPreview version={version} movie={movie} />}>
    <MovieTabs movie={movie} />
  </DetailLayout>;
}
