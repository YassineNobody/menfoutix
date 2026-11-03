import "server-only";

import { db, normalizeSearch } from "@/lib/server/database";
import type { PaginatedResult } from "@/types/commons";
import type { WorkListItemResponse, WorkRow, WorkType } from "@/types/work/work";

export type SearchSort = "title" | "recentlyAdded" | "releaseDate" | "tmdbRating" | "ourRating";
export interface SearchFilters {
  q?: string;
  type?: WorkType;
  genreId?: number;
  actorId?: number;
  releaseYear?: number;
  releaseYearFrom?: number;
  releaseYearTo?: number;
  minTmdbRating?: number;
  minOurRating?: number;
  sort?: SearchSort;
}
export interface SearchChoice { id: number; name: string }
export interface SearchFacets { genres: SearchChoice[]; actors: SearchChoice[] }
const SORT_SQL: Record<SearchSort, string> = {
  title: "COALESCE(NULLIF(w.title_en,''),NULLIF(w.original_title,''),w.title_fr) COLLATE NOCASE,w.id",
  recentlyAdded: "(SELECT MAX(v.published_at) FROM videos v WHERE v.work_id=w.id AND v.version='VO') DESC,w.id DESC",
  releaseDate: "w.release_date DESC,w.id DESC",
  tmdbRating: "w.tmdb_vote_average DESC,w.id DESC",
  ourRating: "w.note DESC,w.id DESC",
};
const VO = "EXISTS(SELECT 1 FROM videos v WHERE v.work_id=w.id AND v.version='VO')";

export function searchWorks(filters: SearchFilters = {}, page = 1, limit = 20): PaginatedResult<WorkListItemResponse> {
  if (!Number.isSafeInteger(page) || page < 1) throw new Error("Invalid page.");
  if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("Invalid limit.");
  const sort = filters.sort ?? "title";
  if (!Object.hasOwn(SORT_SQL, sort)) throw new Error("Invalid sort.");
  const where = [VO];
  const values: (string | number)[] = [];
  const query = filters.q?.trim();
  if (query) {
    const pattern = `%${normalizeSearch(query).replace(/[\\%_]/g, "\\$&")}%`;
    where.push(`(${["title_fr", "title_en", "original_title", "local_title"].map((column) => `normalize_search(COALESCE(w.${column},'')) LIKE ? ESCAPE '\\'`).join(" OR ")})`);
    values.push(pattern, pattern, pattern, pattern);
  }
  if (filters.type !== undefined) {
    if (filters.type !== "film" && filters.type !== "série") throw new Error("Invalid type.");
    where.push("w.type=?"); values.push(filters.type);
  }
  for (const [field, relation] of [["genreId", "EXISTS(SELECT 1 FROM work_genres wg JOIN genres g ON g.id=wg.genre_id WHERE wg.work_id=w.id AND g.tmdb_genre_id=?)"],
    ["actorId", "EXISTS(SELECT 1 FROM work_actors wa JOIN actors a ON a.id=wa.actor_id WHERE wa.work_id=w.id AND a.tmdb_person_id=?)"]] as const) {
    const value = filters[field];
    if (value !== undefined) {
      if (!Number.isSafeInteger(value) || value < 1) throw new Error(`Invalid ${field}.`);
      where.push(relation); values.push(value);
    }
  }
  for (const [field, operator] of [["releaseYear", "="], ["releaseYearFrom", ">="], ["releaseYearTo", "<="]] as const) {
    const value = filters[field];
    if (value !== undefined) {
      if (!Number.isInteger(value) || value < 1 || value > 9999) throw new Error("Invalid year.");
      where.push(`w.release_year ${operator} ?`); values.push(value);
    }
  }
  if (filters.releaseYearFrom !== undefined && filters.releaseYearTo !== undefined && filters.releaseYearFrom > filters.releaseYearTo) throw new Error("Invalid year range.");
  for (const [field, column, max] of [["minTmdbRating", "tmdb_vote_average", 10], ["minOurRating", "note", 5]] as const) {
    const value = filters[field];
    if (value !== undefined) {
      if (!Number.isFinite(value) || value < 0 || value > max) throw new Error("Invalid rating.");
      where.push(`w.${column}>=?`); values.push(value);
    }
  }
  const condition = where.join(" AND ");
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM works w WHERE ${condition}`).get(...values) as { total: number };
  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, Math.max(1, totalPages));
  const rows = db.prepare(`SELECT w.tmdb_id AS tmdbId,w.type,w.title_fr AS titleFr,
    COALESCE(NULLIF(w.title_en,''),NULLIF(w.original_title,''),w.title_fr) AS displayTitle,
    w.title_en AS titleEn,w.original_title AS originalTitle,w.local_title AS localTitle,
    w.release_date AS releaseDate,COALESCE(NULLIF(w.synopsis_en,''),w.synopsis_fr) AS synopsis,
    w.poster_url AS posterUrl,w.backdrop_url AS backdropUrl,w.logo_url AS logoUrl,
    w.tmdb_vote_average AS tmdbRating,w.note AS ourRating,
    (SELECT json_group_array(name) FROM (
      SELECT DISTINCT g.name FROM genres g JOIN work_genres wg ON wg.genre_id=g.id
      WHERE wg.work_id=w.id AND g.name IS NOT NULL ORDER BY g.name
    )) AS genresJson
    FROM works w WHERE ${condition} ORDER BY ${SORT_SQL[sort]} LIMIT ? OFFSET ?
  `).all(...values, limit, (page - 1) * limit) as WorkRow[];
  return { data: rows.map(({ genresJson, ...work }) => ({ ...work, genres: JSON.parse(genresJson) as string[] })), page, limit, total, totalPages };
}

/** Seulement les genres et acteurs associés à une œuvre du catalogue VO. */
export function getSearchFacets(): SearchFacets {
  return {
    genres: db.prepare(`SELECT DISTINCT g.tmdb_genre_id AS id,g.name FROM genres g
      JOIN work_genres wg ON wg.genre_id=g.id JOIN works w ON w.id=wg.work_id
      WHERE g.tmdb_genre_id IS NOT NULL AND ${VO} ORDER BY g.name COLLATE NOCASE`).all() as SearchChoice[],
    actors: db.prepare(`SELECT DISTINCT a.tmdb_person_id AS id,a.name
      FROM videos v
      JOIN work_actors wa ON wa.work_id=v.work_id
      JOIN actors a ON a.id=wa.actor_id
      WHERE v.version='VO' AND a.tmdb_person_id IS NOT NULL
      ORDER BY a.name COLLATE NOCASE`).all() as SearchChoice[],
  };
}
