import type { SeasonResponse, SeriesResponse } from "@/types/series/series";
import { DetailLayout } from "@/components/Details/DetailLayout";
import { SeriesInfoTabs } from "./SeriesInfoTabs";
import { SeriesSeasons } from "./SeriesSeasons";
import { TrailerModal } from "@/components/Modal/ModalTrailer";
import { getYouTubeId } from "@/utils/youtube";

export function SeriesItem({ series, selectedSeason }: {
  series: SeriesResponse;
  selectedSeason: SeasonResponse | null;
}) {
  const trailerId = series.trailerUrl ? getYouTubeId(series.trailerUrl) : null;
  return <DetailLayout title={series.displayTitle} year={series.releaseYear} posterUrl={series.posterUrl}
    actions={<>
      <a href="#seasons" className="flex min-h-12 items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Browse episodes</a>
      {trailerId && <TrailerModal youtubeId={trailerId} />}
    </>}
    footer={<SeriesSeasons series={series} selectedSeason={selectedSeason} />}>
    <SeriesInfoTabs series={series} />
  </DetailLayout>;
}
