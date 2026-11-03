import "server-only";
import { db } from "@/lib/server/database";
import type { PaginatedResult } from "@/types/commons";
import type { WorkListItemResponse, WorkRow } from "@/types/work/work";

export type GenreMovieSort = "recentlyAdded" | "releaseDate" | "tmdbRating" | "title";
const SORT_SQL: Record<GenreMovieSort, string> = {
  recentlyAdded: "(SELECT MAX(v.published_at) FROM videos v WHERE v.work_id=w.id AND v.version = 'VO') DESC, w.id DESC",
  releaseDate: "w.release_date DESC, w.id DESC",
  tmdbRating: "w.tmdb_vote_average DESC, w.id DESC",
  title: "COALESCE(NULLIF(w.title_en,''),w.title_fr) COLLATE NOCASE, w.id",
};

export function getMoviesByGenre(genreId: number, page = 1, limit = 18,
  filters: { sort?: GenreMovieSort; releaseYear?: number; minTmdbRating?: number } = {},
): PaginatedResult<WorkListItemResponse> {
  if (!Number.isSafeInteger(genreId) || genreId < 1) throw new Error("Genre invalide.");
  if (!Number.isSafeInteger(page) || page < 1) throw new Error("Page invalide.");
  if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("Limite invalide.");
  const sort = filters.sort ?? "recentlyAdded";
  if (!Object.hasOwn(SORT_SQL, sort)) throw new Error("Tri invalide.");
  const { releaseYear, minTmdbRating } = filters;
  if (releaseYear !== undefined && (!Number.isInteger(releaseYear) || releaseYear < 1900 || releaseYear > 2100)) throw new Error("Année invalide.");
  if (minTmdbRating !== undefined && (!Number.isFinite(minTmdbRating) || minTmdbRating < 0 || minTmdbRating > 10)) throw new Error("Note invalide.");

  const where = `w.type='film'
    AND EXISTS (SELECT 1 FROM videos v WHERE v.work_id=w.id AND v.version = 'VO')
    AND EXISTS (SELECT 1 FROM work_genres wg JOIN genres g ON g.id=wg.genre_id WHERE wg.work_id=w.id AND g.tmdb_genre_id=?)
    ${releaseYear !== undefined ? "AND w.release_year=?" : ""}
    ${minTmdbRating !== undefined ? "AND w.tmdb_vote_average>=?" : ""}`;
  const values: number[] = [genreId];
  if (releaseYear !== undefined) values.push(releaseYear);
  if (minTmdbRating !== undefined) values.push(minTmdbRating);
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM works w WHERE ${where}`).get(...values) as { total: number };
  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, Math.max(1, totalPages));
  const rows = db.prepare(`SELECT
    w.tmdb_id AS tmdbId,w.type,w.title_fr AS titleFr,
        COALESCE(NULLIF(w.title_en,''),NULLIF(w.original_title,''),w.title_fr) AS displayTitle,w.title_en AS titleEn,
    w.original_title AS originalTitle,w.local_title AS localTitle,w.release_date AS releaseDate,
    COALESCE(NULLIF(w.synopsis_en,''),w.synopsis_fr) AS synopsis,w.poster_url AS posterUrl,w.backdrop_url AS backdropUrl,
    w.logo_url AS logoUrl,w.tmdb_vote_average AS tmdbRating,w.note AS ourRating,
    (SELECT json_group_array(name) FROM (
      SELECT DISTINCT g.name FROM genres g JOIN work_genres wg ON wg.genre_id=g.id
      WHERE wg.work_id=w.id AND g.name IS NOT NULL ORDER BY g.name
    )) AS genresJson
    FROM works w WHERE ${where} ORDER BY ${SORT_SQL[sort]} LIMIT ? OFFSET ?
  `).all(...values, limit, (page - 1) * limit) as WorkRow[];
  return {
    data: rows.map(({ genresJson, ...movie }) => ({
      ...movie, genres: JSON.parse(genresJson) as string[],
    })), page, limit, total, totalPages,
  };
}
