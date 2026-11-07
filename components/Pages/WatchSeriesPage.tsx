import type { CatalogueVersion } from "@/lib/catalogue";
import Link from "@/components/Catalogue/CatalogueLink";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, ListVideo } from "lucide-react";
import { getOneSeries, getSeriesSeason } from "@/lib/services/series";

interface Props {
  version?: CatalogueVersion;
  params: Promise<{ idTmdb: string; season: string; episode: string }>;
}

export default async function WatchSeriesPage({ params, version = "VO" }: Props) {
  const french = version === "VF";
  const seasonLabel = (number: number) => `${french ? "Saison" : "Season"} ${number}`;
  const episodeLabel = (season: number, episode: number) => `${seasonLabel(season)}, ${french ? "épisode" : "episode"} ${episode}`;
  const route = await params;
  if (!/^\d+$/.test(route.idTmdb) || !/^\d+$/.test(route.season) || !/^\d+$/.test(route.episode)) notFound();
  const tmdbId = Number(route.idTmdb);
  const seasonNumber = Number(route.season);
  const episodeNumber = Number(route.episode);
  if (![tmdbId, seasonNumber, episodeNumber].every(Number.isSafeInteger) || tmdbId < 1 || seasonNumber < 0 || episodeNumber < 1) notFound();
  const series = getOneSeries(tmdbId, version);
  if (!series) notFound();
  const seasons = series.seasons.map((season) => getSeriesSeason(tmdbId, season.seasonNumber, version)).filter((season) => season !== null);
  const season = seasons.find((item) => item.seasonNumber === seasonNumber);
  const current = season?.episodes.find((item) => item.episodeNumber === episodeNumber);
  if (!current) notFound();
  // Les épisodes spéciaux restent séparés de la chronologie des saisons normales.
  const timeline = seasons.filter((item) => seasonNumber === 0 ? item.seasonNumber === 0 : item.seasonNumber > 0)
    .sort((a, b) => a.seasonNumber - b.seasonNumber)
    .flatMap((item) => [...item.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber).map((episode) => ({ seasonNumber: item.seasonNumber, ...episode })));
  const index = timeline.findIndex((item) => item.id === current.id);
  const previous = timeline[index - 1];
  const next = timeline[index + 1];
  const video = current.videos.find((item) => item.videoId);
  const href = (season: number, episode: number) => `/watch/tv/${tmdbId}/s/${season}/e/${episode}`;
  const controls = "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 text-sm text-white shadow-lg transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-red-500";
  const embedParams = new URLSearchParams({ autoplay: "1", rel: "0", cc_load_policy: version === "VO" ? "1" : "0", cc_lang_pref: "fr", hl: "fr" });

  return <div className="fixed inset-0 z-[12000] h-dvh overflow-hidden bg-black text-white">
    <nav aria-label={french ? "Navigation du lecteur d’épisodes" : "Episode player navigation"} className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-6">
      <Link href={`/tv/${tmdbId}?season=${seasonNumber}#seasons`} className={`${controls} pointer-events-auto`}><ArrowLeft size={18} aria-hidden="true" />{french ? "Retour" : "Back"}</Link>
      <div className="pointer-events-auto flex max-w-full flex-wrap justify-end gap-2">
        {video && <a href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`} target="_blank" rel="noopener noreferrer" aria-label={french ? "Regarder sur YouTube" : "Watch on YouTube"} className={controls}><ExternalLink size={17} aria-hidden="true" /></a>}
        {previous && <Link href={href(previous.seasonNumber, previous.episodeNumber)} prefetch={false} aria-label={french ? "Épisode précédent" : "Previous episode"} title={episodeLabel(previous.seasonNumber, previous.episodeNumber)} className={controls}><ChevronLeft size={17} aria-hidden="true" /><span className="hidden sm:inline">S{previous.seasonNumber}:E{previous.episodeNumber}</span></Link>}
        <details key={`${seasonNumber}-${episodeNumber}`} className="group relative">
          <summary className={`${controls} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}><ListVideo size={18} aria-hidden="true" />S{seasonNumber}:E{episodeNumber}</summary>
          <div className="absolute right-0 top-full mt-2 max-h-[65dvh] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-white/15 bg-zinc-950 p-3 shadow-2xl [color-scheme:dark]">
            <p className="mb-3 text-sm font-semibold">{series.displayTitle}</p>
            {seasons.map((item) => <section key={item.id} aria-label={item.name} className="mb-3 last:mb-0">
              <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-500">{item.seasonNumber === 0 ? (french ? "Épisodes spéciaux" : "Specials") : seasonLabel(item.seasonNumber)}</h2>
              <ol>{item.episodes.map((episode) => <li key={episode.id}><Link href={href(item.seasonNumber, episode.episodeNumber)} prefetch={false} aria-current={episode.id === current.id ? "page" : undefined} className={`block rounded-lg px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-red-500 ${episode.id === current.id ? "bg-red-600/20 text-red-300" : "text-zinc-300"}`}>
                {episode.episodeNumber}. {episode.title}{!episode.available && <span className="mt-0.5 block text-xs text-zinc-500">{french ? "Pas encore disponible" : "Not available yet"}</span>}
              </Link></li>)}</ol>
            </section>)}
          </div>
        </details>
        {next && <Link href={href(next.seasonNumber, next.episodeNumber)} prefetch={false} aria-label={french ? "Épisode suivant" : "Next episode"} title={episodeLabel(next.seasonNumber, next.episodeNumber)} className={controls}><span className="hidden sm:inline">S{next.seasonNumber}:E{next.episodeNumber}</span><ChevronRight size={17} aria-hidden="true" /></Link>}
      </div>
    </nav>
    {video ? <iframe key={video.videoId} src={`https://www.youtube.com/embed/${encodeURIComponent(video.videoId)}?${embedParams}`} title={`${series.displayTitle} — ${episodeLabel(seasonNumber, episodeNumber)} : ${current.title}`} className="h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      : <div role="status" className="flex h-full flex-col items-center justify-center gap-3 px-6 pt-28 text-center"><h1 className="text-lg font-semibold">{current.title}</h1><p className="text-zinc-400">{french ? "Cet épisode n’est pas encore disponible." : "This episode is not available yet."}</p><p className="text-sm text-zinc-500">{french ? "Choisissez un autre épisode dans le menu ci-dessus." : "Choose another episode from the menu above."}</p></div>}
  </div>;
}

export const metadata = { title: "MenFouTix" };
