import { localizedTextSql, versionSql, type CatalogueVersion } from "@/lib/catalogue";
import "server-only";

import { db } from "@/lib/server/database";
import type { PaginatedResult } from "@/types/commons";
import type { ActorResponse, GenreResponse, MetadataItem, VideoRow } from "@/types/movies/movies";
import type {
  EpisodeResponse, EpisodeRow, EpisodeSummary, SeasonResponse, SeasonRow,
  SeasonSummary, SeriesFilters, SeriesListItem, SeriesListRow, SeriesResponse,
  SeriesRow, SeriesSort,
} from "@/types/series/series";

// Les noms de colonnes du tri proviennent uniquement de cette liste fixe.
const SORT_SQL = (version: CatalogueVersion): Record<SeriesSort, string> => ({
  recentlyAdded: `(SELECT MAX(v.published_at) FROM videos v WHERE v.work_id=w.id AND v.version=${versionSql(version)}) DESC, w.id DESC`,
  releaseDate: "w.release_date DESC, w.id DESC",
  tmdbRating: "w.tmdb_vote_average DESC, w.id DESC",
  title: `${localizedTextSql(version, "w.title_fr", "w.title_en", "w.original_title")} COLLATE NOCASE, w.id`,
});
const seriesScope = (version: CatalogueVersion) => `w.type='série' AND EXISTS (
  SELECT 1 FROM videos v WHERE v.work_id=w.id AND v.version=${versionSql(version)}
)`;

function positiveInteger(value: number, name: string) {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${name} doit être un entier positif.`);
}
function seasonNumber(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("seasonNumber doit être un entier positif ou nul.");
}
function metadata(value: string | null, field: string): MetadataItem[] {
  if (value === null) return [];
  const parsed: unknown = JSON.parse(value);
  if (parsed === null) return [];
  if (!Array.isArray(parsed)) throw new Error(`Métadonnées invalides : ${field}.`);
  return parsed.map((item: unknown) => {
    if (typeof item === "string" && item.trim()) return { name: item.trim() };
    if (typeof item === "object" && item !== null && !Array.isArray(item) &&
        "name" in item && typeof item.name === "string" && item.name.trim()) {
      return { ...item, name: item.name.trim() };
    }
    throw new Error(`Métadonnées invalides : ${field}.`);
  });
}

/** Séries disposant d’au moins une vidéo VO. Pagination par série, pas par vidéo. */
export function getSeries(
  sort: SeriesSort = "recentlyAdded", page = 1, limit = 18, filters: SeriesFilters = {},
  version: CatalogueVersion = "VO",
): PaginatedResult<SeriesListItem> {
  positiveInteger(page, "page");
  positiveInteger(limit, "limit");
  if (!Object.hasOwn(SORT_SQL(version), sort)) throw new Error("Tri invalide.");
  const { genreId, releaseYear, minTmdbRating } = filters;
  if (genreId !== undefined) positiveInteger(genreId, "genreId");
  if (releaseYear !== undefined && (!Number.isInteger(releaseYear) || releaseYear < 1900 || releaseYear > 2100)) throw new Error("Année invalide.");
  if (minTmdbRating !== undefined && (!Number.isFinite(minTmdbRating) || minTmdbRating < 0 || minTmdbRating > 10)) throw new Error("Note invalide.");
  const clauses = [seriesScope(version)];
  const values: number[] = [];
  if (genreId !== undefined) {
    clauses.push("EXISTS(SELECT 1 FROM work_genres wg JOIN genres g ON g.id=wg.genre_id WHERE wg.work_id=w.id AND g.tmdb_genre_id=?)");
    values.push(genreId);
  }
  if (releaseYear !== undefined) { clauses.push("w.release_year=?"); values.push(releaseYear); }
  if (minTmdbRating !== undefined) { clauses.push("w.tmdb_vote_average>=?"); values.push(minTmdbRating); }
  const where = clauses.join(" AND ");
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM works w WHERE ${where}`).get(...values) as { total: number };
  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, Math.max(1, totalPages));
  const rows = db.prepare(`SELECT w.tmdb_id AS tmdbId,w.type,
    ${localizedTextSql(version, "w.title_fr", "w.title_en", "w.original_title")} AS displayTitle,
    w.title_fr AS titleFr,w.title_en AS titleEn,w.original_title AS originalTitle,w.local_title AS localTitle,
    w.release_date AS releaseDate,${localizedTextSql(version, "w.synopsis_fr", "w.synopsis_en")} AS synopsis,
    w.poster_url AS posterUrl,w.backdrop_url AS backdropUrl,w.logo_url AS logoUrl,
    w.tmdb_vote_average AS tmdbRating,w.note AS ourRating,
    (SELECT json_group_array(name) FROM (
      SELECT DISTINCT g.name FROM genres g JOIN work_genres wg ON wg.genre_id=g.id
      WHERE wg.work_id=w.id AND g.name IS NOT NULL ORDER BY g.name
    )) AS genresJson,
    (SELECT COUNT(*) FROM seasons s WHERE s.work_id=w.id) AS seasonCount,
    (SELECT COUNT(*) FROM episodes e JOIN seasons s ON s.id=e.season_id WHERE s.work_id=w.id) AS episodeCount,
    (SELECT COUNT(*) FROM episodes e JOIN seasons s ON s.id=e.season_id WHERE s.work_id=w.id
      AND EXISTS(SELECT 1 FROM videos v WHERE v.episode_id=e.id AND v.work_id=w.id AND v.version=${versionSql(version)})) AS availableEpisodeCount
    FROM works w WHERE ${where} ORDER BY ${SORT_SQL(version)[sort]} LIMIT ? OFFSET ?
  `).all(...values, limit, (page - 1) * limit) as SeriesListRow[];
  return {
    data: rows.map(({ genresJson, ...series }) => ({ ...series, genres: JSON.parse(genresJson) as string[] })),
    page, limit, total, totalPages,
  };
}

function seriesWorkId(tmdbId: number, version: CatalogueVersion): number | null {
  positiveInteger(tmdbId, "tmdbId");
  const row = db.prepare(`SELECT w.id FROM works w WHERE ${seriesScope(version)} AND w.tmdb_id=?`).get(tmdbId) as { id: number } | undefined;
  return row?.id ?? null;
}

function seasonsForWork(workId: number, version: CatalogueVersion): SeasonSummary[] {
  const rows = db.prepare(`SELECT s.id,s.work_id AS workId,s.tmdb_season_id AS tmdbSeasonId,
    s.season_number AS seasonNumber,
    ${localizedTextSql(version, "s.name_fr", "s.name_en", `${version === "VF" ? "'Saison '" : "'Season '"} || s.season_number`)} AS name,
    ${localizedTextSql(version, "s.synopsis_fr", "s.synopsis_en")} AS synopsis,s.air_date AS airDate,s.poster_url AS posterUrl,
    (SELECT COUNT(*) FROM episodes e WHERE e.season_id=s.id) AS episodeCount,
    (SELECT COUNT(*) FROM episodes e WHERE e.season_id=s.id AND EXISTS (
      SELECT 1 FROM videos v WHERE v.episode_id=e.id AND v.work_id=s.work_id AND v.version=${versionSql(version)}
    )) AS availableEpisodeCount,
    EXISTS(SELECT 1 FROM videos v JOIN episodes e ON e.id=v.episode_id
      WHERE e.season_id=s.id AND v.work_id=s.work_id AND v.version=${versionSql(version)}) AS available
    FROM seasons s WHERE s.work_id=? ORDER BY s.season_number,s.id
  `).all(workId) as SeasonRow[];
  return rows.map(({ available, ...season }) => ({ ...season, available: Boolean(available) }));
}

/** Toutes les saisons, y compris les spéciales (0) et celles sans vidéo VO. */
export function getSeriesSeasons(tmdbId: number, version: CatalogueVersion = "VO"): SeasonSummary[] {
  const workId = seriesWorkId(tmdbId, version);
  return workId === null ? [] : seasonsForWork(workId, version);
}

/** Fiche de série et résumés des saisons. null si absente du catalogue VO. */
export function getOneSeries(tmdbId: number, version: CatalogueVersion = "VO"): SeriesResponse | null {
  positiveInteger(tmdbId, "tmdbId");
  const row = db.prepare(`SELECT w.id,w.tmdb_id AS tmdbId,w.type,
    ${localizedTextSql(version, "w.title_fr", "w.title_en", "w.original_title")} AS displayTitle,
    w.title_fr AS titleFr,w.title_en AS titleEn,w.original_title AS originalTitle,w.local_title AS localTitle,
    ${localizedTextSql(version, "w.synopsis_fr", "w.synopsis_en")} AS synopsis,
    w.release_date AS releaseDate,w.release_year AS releaseYear,w.poster_url AS posterUrl,
    w.backdrop_url AS backdropUrl,w.logo_url AS logoUrl,w.trailer_url AS trailerUrl,
    w.tmdb_vote_average AS tmdbVoteAverage,w.tmdb_vote_count AS tmdbVoteCount,
    w.note,w.recommendation,w.certification_fr AS certificationFr,
    w.creators_json AS creatorsJson,w.production_companies_json AS productionCompaniesJson
    FROM works w WHERE ${seriesScope(version)} AND w.tmdb_id=?
  `).get(tmdbId) as SeriesRow | undefined;
  if (!row) return null;
  const { creatorsJson, productionCompaniesJson, ...series } = row;
  const genres = db.prepare(`SELECT g.tmdb_genre_id AS id,g.name FROM genres g
    JOIN work_genres wg ON wg.genre_id=g.id WHERE wg.work_id=? ORDER BY g.name COLLATE NOCASE
  `).all(row.id) as GenreResponse[];
  const actors = db.prepare(`SELECT a.tmdb_person_id AS id,a.name,a.profile_url AS profileUrl,wa.character
    FROM actors a JOIN work_actors wa ON wa.actor_id=a.id WHERE wa.work_id=?
    ORDER BY wa.billing_order,a.id LIMIT 30
  `).all(row.id) as ActorResponse[];
  return { ...series, creators: metadata(creatorsJson, "creators"),
    productionCompanies: metadata(productionCompaniesJson, "productionCompanies"),
    genres, actors, seasons: seasonsForWork(row.id, version) };
}

/** Tous les épisodes d’une saison ; deux requêtes groupées, aucune requête par épisode. */
function episodesForSeason(workId: number, seasonId: number, version: CatalogueVersion): EpisodeSummary[] {
  const rows = db.prepare(`SELECT e.id,e.season_id AS seasonId,e.tmdb_episode_id AS tmdbEpisodeId,
    e.episode_number AS episodeNumber,
    ${localizedTextSql(version, "e.title_fr", "e.title_en", `${version === "VF" ? "'Épisode '" : "'Episode '"} || e.episode_number`)} AS title,
    ${localizedTextSql(version, "e.synopsis_fr", "e.synopsis_en")} AS synopsis,e.air_date AS airDate,
    e.runtime_minutes AS runtimeMinutes,e.still_url AS stillUrl,
    e.tmdb_vote_average AS tmdbVoteAverage,e.tmdb_vote_count AS tmdbVoteCount,e.directors_json AS directorsJson
    FROM episodes e JOIN seasons s ON s.id=e.season_id
    WHERE e.season_id=? AND s.work_id=? ORDER BY e.episode_number,e.id
  `).all(seasonId, workId) as EpisodeRow[];
  const videos = db.prepare(`SELECT v.episode_id AS episodeId,v.video_id AS videoId,v.version,
    v.source_title AS sourceTitle,v.description,v.thumbnail_url AS thumbnailUrl,v.definition,
    v.privacy_status AS privacyStatus,v.embeddable,v.published_at AS publishedAt,
    v.channel_id AS channelId,v.channel_title AS channelTitle
    FROM videos v JOIN episodes e ON e.id=v.episode_id JOIN seasons s ON s.id=e.season_id
    WHERE s.id=? AND s.work_id=? AND v.work_id=? AND v.version=${versionSql(version)}
    ORDER BY v.published_at DESC,v.video_id
  `).all(seasonId, workId, workId) as (VideoRow & { episodeId: number })[];
  const byEpisode = new Map<number, EpisodeSummary["videos"]>();
  for (const { episodeId, embeddable, ...video } of videos) {
    const items = byEpisode.get(episodeId) ?? [];
    items.push({ ...video, embeddable: Boolean(embeddable) });
    byEpisode.set(episodeId, items);
  }
  return rows.map(({ directorsJson, ...episode }) => {
    const videos = byEpisode.get(episode.id) ?? [];
    return { ...episode, directors: metadata(directorsJson, "episode.directors"), available: videos.length > 0, videos };
  });
}

/** seasonNumber est le numéro de saison (0,1,2…), pas son ID SQLite ou TMDB. */
export function getSeriesSeason(tmdbId: number, number: number, version: CatalogueVersion = "VO"): SeasonResponse | null {
  seasonNumber(number);
  const workId = seriesWorkId(tmdbId, version);
  if (workId === null) return null;
  const season = seasonsForWork(workId, version).find((item) => item.seasonNumber === number);
  return season ? { ...season, episodes: episodesForSeason(workId, season.id, version) } : null;
}

/** Identité : série TMDB + numéro de saison + numéro d’épisode. */
export function getSeriesEpisode(tmdbId: number, season: number, episode: number, version: CatalogueVersion = "VO"): EpisodeResponse | null {
  positiveInteger(episode, "episodeNumber");
  const details = getSeriesSeason(tmdbId, season, version);
  const selected = details?.episodes.find((item) => item.episodeNumber === episode);
  if (!selected) return null;
  const actors = db.prepare(`SELECT a.tmdb_person_id AS id,a.name,a.profile_url AS profileUrl,ea.character
    FROM actors a JOIN episode_actors ea ON ea.actor_id=a.id WHERE ea.episode_id=?
    ORDER BY ea.billing_order,a.id LIMIT 30
  `).all(selected.id) as ActorResponse[];
  return { ...selected, actors };
}
