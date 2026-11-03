import { notFound } from "next/navigation";
import { getOneSeries, getSeriesSeason } from "@/lib/services/series";
import { SeriesItem } from "@/components/Series/SeriesItem";

interface Props {
  params: Promise<{ idTmdb: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SeriesPage({ params, searchParams }: Props) {
  const [{ idTmdb }, query] = await Promise.all([params, searchParams]);
  const tmdbId = Number(idTmdb);
  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) notFound();
  const series = getOneSeries(tmdbId);
  if (!series) notFound();

  const requestedSeason = typeof query.season === "string" && query.season.trim() !== "" ? Number(query.season) : NaN;
  const explicitSeason = Number.isSafeInteger(requestedSeason) && requestedSeason >= 0
    ? series.seasons.find((season) => season.seasonNumber === requestedSeason) : undefined;
  const defaultSeason = series.seasons.find((season) => season.seasonNumber > 0 && season.available)
    ?? series.seasons.find((season) => season.available)
    ?? series.seasons[0];
  const selected = explicitSeason ?? defaultSeason;
  const selectedSeason = selected ? getSeriesSeason(tmdbId, selected.seasonNumber) : null;

  return (
    <div className="relative min-h-screen bg-black pt-20 text-white">
      {series.backdropUrl && <>
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat opacity-50 lg:bg-top lg:bg-size-[100%_auto]"
          style={{ backgroundImage: `url("${series.backdropUrl}")` }} />
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-linear-to-b from-black/40 via-black/65 to-black" />
      </>}
      <div className="relative z-10 px-4 py-6 md:px-8 lg:px-16">
        <SeriesItem key={series.tmdbId} series={series} selectedSeason={selectedSeason} />
      </div>
    </div>
  );
}
