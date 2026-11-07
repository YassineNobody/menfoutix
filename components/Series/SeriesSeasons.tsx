import Link from "@/components/Catalogue/CatalogueLink";
import { Check, Clock, Film, LockKeyhole, Play } from "lucide-react";
import type { SeasonResponse, SeriesResponse } from "@/types/series/series";

export function SeriesSeasons({ series, selectedSeason }: {
  series: SeriesResponse;
  selectedSeason: SeasonResponse | null;
}) {
  return (
    <section id="seasons" aria-label="Seasons and episodes" className="mt-12 scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-montserrat text-xl font-semibold">Seasons & episodes</h2>
        <p className="text-xs text-zinc-400">{series.seasons.reduce((sum, season) => sum + season.availableEpisodeCount, 0)} episodes available</p>
      </div>
      {series.seasons.length === 0 ? <p className="rounded-xl border border-white/10 bg-zinc-950/70 p-5 text-sm text-zinc-400">No seasons listed yet.</p> : <>
        <nav aria-label="Choose a season" className="mb-6 flex gap-2 overflow-x-auto pb-3 [color-scheme:dark] [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]">
          {series.seasons.map((season) => (
            <Link key={season.id} href={`/tv/${series.tmdbId}?season=${season.seasonNumber}#seasons`} scroll={false}
              aria-current={selectedSeason?.id === season.id ? "true" : undefined}
              className={`min-w-36 shrink-0 rounded-xl border px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-red-500 ${selectedSeason?.id === season.id ? "border-red-500/50 bg-red-950/50 text-white" : "border-white/10 bg-zinc-950/70 text-zinc-400 hover:border-white/25 hover:text-white"}`}>
              <span className="block text-sm font-semibold">{season.seasonNumber === 0 ? "Specials" : `Season ${season.seasonNumber}`}</span>
              <span className="mt-1 block text-xs text-zinc-400">{season.availableEpisodeCount}/{season.episodeCount} available</span>
            </Link>
          ))}
        </nav>
        {selectedSeason && <div>
          <div className="mb-5">
            <h3 className="text-lg font-semibold">{selectedSeason.name}</h3>
            {selectedSeason.synopsis && <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-400">{selectedSeason.synopsis}</p>}
          </div>
          {selectedSeason.episodes.length === 0 ? <p className="py-8 text-sm text-zinc-400">No episodes listed for this season.</p> : (
            <ol className="space-y-3">
              {selectedSeason.episodes.map((episode) => {
                const image = episode.stillUrl || episode.videos[0]?.thumbnailUrl;
                return (
                  <li key={episode.id} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-zinc-950/75 p-3 sm:flex-row sm:p-4">
                    <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-zinc-900 sm:w-44 md:w-52">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      ) : <div className="flex h-full items-center justify-center text-zinc-600"><Film size={28} aria-hidden="true" /></div>}
                    </div>
                    <div className="min-w-0 flex-1 py-1">
                      <h4 className="text-base font-semibold"><span className="mr-2 text-red-400">{episode.episodeNumber}.</span>{episode.title}</h4>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        {episode.airDate && <time dateTime={episode.airDate}>{episode.airDate}</time>}
                        {episode.runtimeMinutes !== null && <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" />{episode.runtimeMinutes} min</span>}
                      </div>
                      {episode.synopsis && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{episode.synopsis}</p>}
                      {episode.available && <Link href={`/watch/tv/${series.tmdbId}/s/${selectedSeason.seasonNumber}/e/${episode.episodeNumber}`} prefetch={false} className="mt-3 mr-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2"><Play size={16} aria-hidden="true" />Watch episode</Link>}
                      <p className={`mt-3 inline-flex items-center gap-1.5 text-xs ${episode.available ? "text-emerald-400" : "text-zinc-500"}`}>
                        {episode.available ? <Check size={13} aria-hidden="true" /> : <LockKeyhole size={13} aria-hidden="true" />}
                        {episode.available ? "Available" : "Not available yet"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>}
      </>}
    </section>
  );
}
