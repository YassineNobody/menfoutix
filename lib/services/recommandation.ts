import "server-only";
import { db } from "../server/database";
import { PaginatedResult } from "@/types/commons";
import { WorkListItemResponse, WorkRow } from "@/types/work/work";

export function getRecommandationTmdbRating(
  page: number = 1,
  limit: number = 10,
): PaginatedResult<WorkListItemResponse> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("page doit être un entier positif.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("limit doit être un entier positif.");
  }

  const { total } = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM works AS w
      WHERE w.type = 'film' AND EXISTS (
        SELECT 1
        FROM videos AS v
        WHERE v.work_id = w.id AND v.version = 'VO'
      );
    `,
    )
    .get() as { total: number };

  const totalPages = Math.ceil(total / limit);

  page = Math.min(page, Math.max(1, totalPages));

  const offset = (page - 1) * limit;

  const rows = db
    .prepare(
      `
      SELECT

        w.tmdb_id AS tmdbId,
        w.type,
        w.title_fr AS titleFr,
        COALESCE(NULLIF(w.title_en,''),NULLIF(w.original_title,''),w.title_fr) AS displayTitle,
        w.title_en AS titleEn,
        w.original_title AS originalTitle,
        w.local_title AS localTitle,
        w.release_date AS releaseDate,
        COALESCE(NULLIF(w.synopsis_en,''),w.synopsis_fr) AS synopsis,
        w.poster_url AS posterUrl,
        w.backdrop_url AS backdropUrl,
        w.logo_url AS logoUrl,
        w.tmdb_vote_average AS tmdbRating,
        w.note AS ourRating,

        (
          SELECT json_group_array(name)
          FROM (
            SELECT DISTINCT g.name AS name
            FROM work_genres AS wg
            JOIN genres AS g ON g.id = wg.genre_id
            WHERE wg.work_id = w.id
              AND g.name IS NOT NULL
            ORDER BY g.name
          )
        ) AS genresJson

      FROM works AS w

      WHERE EXISTS (
        SELECT 1
        FROM videos AS v
        WHERE v.work_id = w.id AND v.version = 'VO'
      )

      ORDER BY w.tmdb_vote_average DESC, w.id DESC
      LIMIT ? OFFSET ?;
    `,
    )
    .all(limit, offset) as WorkRow[];

  const data: WorkListItemResponse[] = rows.map(
    ({ genresJson, ...work }) => ({
      ...work,
      genres: JSON.parse(genresJson) as string[],
    }),
  );

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}

export function getMovieRecommendationsTmdbRating(
  page: number = 1,
  limit: number = 10,
): PaginatedResult<WorkListItemResponse> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("page doit être un entier positif.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("limit doit être un entier positif.");
  }

  const { total } = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM works AS w
      WHERE w.type = 'film'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id AND v.version = 'VO'
        );
    `,
    )
    .get() as { total: number };

  const totalPages = Math.ceil(total / limit);

  page = Math.min(page, Math.max(1, totalPages));

  const offset = (page - 1) * limit;

  const rows = db
    .prepare(
      `
      SELECT

        w.tmdb_id AS tmdbId,
        w.type,
        w.title_fr AS titleFr,
        COALESCE(NULLIF(w.title_en,''),NULLIF(w.original_title,''),w.title_fr) AS displayTitle,
        w.title_en AS titleEn,
        w.original_title AS originalTitle,
        w.local_title AS localTitle,
        w.release_date AS releaseDate,
        COALESCE(NULLIF(w.synopsis_en,''),w.synopsis_fr) AS synopsis,
        w.poster_url AS posterUrl,
        w.backdrop_url AS backdropUrl,
        w.logo_url AS logoUrl,
        w.tmdb_vote_average AS tmdbRating,
        w.note AS ourRating,

        (
          SELECT json_group_array(name)
          FROM (
            SELECT DISTINCT g.name AS name
            FROM work_genres AS wg
            JOIN genres AS g ON g.id = wg.genre_id
            WHERE wg.work_id = w.id
              AND g.name IS NOT NULL
            ORDER BY g.name
          )
        ) AS genresJson

      FROM works AS w

      WHERE w.type = 'film'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id AND v.version = 'VO'
        )

      ORDER BY w.tmdb_vote_average DESC, w.id DESC
      LIMIT ? OFFSET ?;
    `,
    )
    .all(limit, offset) as WorkRow[];

  const data: WorkListItemResponse[] = rows.map(
    ({ genresJson, ...work }) => ({
      ...work,
      genres: JSON.parse(genresJson) as string[],
    }),
  );

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}

export function getRecentMoviesByRating(
  page: number = 1,
  limit: number = 10,
): PaginatedResult<WorkListItemResponse> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("page doit être un entier positif.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("limit doit être un entier positif.");
  }

  const { total } = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM works AS w
      WHERE w.type = 'film'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id AND v.version = 'VO'
        );
    `,
    )
    .get() as { total: number };

  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, Math.max(1, totalPages));

  const offset = (page - 1) * limit;

  const rows = db
    .prepare(
      `
      SELECT

        w.tmdb_id AS tmdbId,
        w.type,
        w.title_fr AS titleFr,
        COALESCE(NULLIF(w.title_en,''),NULLIF(w.original_title,''),w.title_fr) AS displayTitle,
        w.title_en AS titleEn,
        w.original_title AS originalTitle,
        w.local_title AS localTitle,
        w.release_date AS releaseDate,
        COALESCE(NULLIF(w.synopsis_en,''),w.synopsis_fr) AS synopsis,
        w.poster_url AS posterUrl,
        w.backdrop_url AS backdropUrl,
        w.logo_url AS logoUrl,
        w.tmdb_vote_average AS tmdbRating,
        w.note AS ourRating,

        (
          SELECT json_group_array(name)
          FROM (
            SELECT DISTINCT g.name AS name
            FROM work_genres AS wg
            JOIN genres AS g ON g.id = wg.genre_id
            WHERE wg.work_id = w.id
              AND g.name IS NOT NULL
            ORDER BY g.name
          )
        ) AS genresJson

      FROM works AS w

      WHERE w.type = 'film'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id AND v.version = 'VO'
        )

      ORDER BY
        w.release_date DESC,
        w.tmdb_vote_average DESC,
        w.id DESC

      LIMIT ? OFFSET ?;
    `,
    )
    .all(limit, offset) as WorkRow[];

  const data: WorkListItemResponse[] = rows.map(
    ({ genresJson, ...work }) => ({
      ...work,
      genres: JSON.parse(genresJson) as string[],
    }),
  );

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}

export function getRecentSeriesByRating(
  page: number = 1,
  limit: number = 10,
): PaginatedResult<WorkListItemResponse> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("page doit être un entier positif.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("limit doit être un entier positif.");
  }

  const { total } = db
    .prepare(`
      SELECT COUNT(*) AS total
      FROM works AS w
      WHERE w.type = 'série'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id
            AND v.version = 'VO'
        );
    `)
    .get() as { total: number };

  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, Math.max(1, totalPages));

  const offset = (page - 1) * limit;

  const rows = db
    .prepare(`
      SELECT
        w.tmdb_id AS tmdbId,
        w.type,
        w.title_fr AS titleFr,
        COALESCE(
          NULLIF(w.title_en, ''),
          NULLIF(w.original_title, ''),
          w.title_fr
        ) AS displayTitle,
        w.title_en AS titleEn,
        w.original_title AS originalTitle,
        w.local_title AS localTitle,
        w.release_date AS releaseDate,
        COALESCE(NULLIF(w.synopsis_en, ''), w.synopsis_fr) AS synopsis,
        w.poster_url AS posterUrl,
        w.backdrop_url AS backdropUrl,
        w.logo_url AS logoUrl,
        w.tmdb_vote_average AS tmdbRating,
        w.note AS ourRating,

        (
          SELECT json_group_array(name)
          FROM (
            SELECT DISTINCT g.name AS name
            FROM work_genres AS wg
            JOIN genres AS g ON g.id = wg.genre_id
            WHERE wg.work_id = w.id
              AND g.name IS NOT NULL
            ORDER BY g.name
          )
        ) AS genresJson

      FROM works AS w

      WHERE w.type = 'série'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id
            AND v.version = 'VO'
        )

      ORDER BY
        w.release_date DESC,
        w.tmdb_vote_average DESC,
        w.id DESC

      LIMIT ? OFFSET ?;
    `)
    .all(limit, offset) as WorkRow[];

  const data: WorkListItemResponse[] = rows.map(
    ({ genresJson, ...work }) => ({
      ...work,
      genres: JSON.parse(genresJson) as string[],
    }),
  );

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}