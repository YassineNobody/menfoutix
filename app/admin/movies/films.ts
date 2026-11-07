import type { CatalogueType, FilmPlaylist, FilmRow, PaginatedResult } from "./film-types";
import { db, normalizeSearch } from "@/lib/server/database";

export function getCountFilms(type: CatalogueType = "film") {
  return db
    .prepare(
      `
        SELECT COUNT(w.id) as total
        FROM works AS w
        WHERE w.type = ?;
        `,
    )
    .get(type) as { total: number };
}

export function getCountVersion(type: CatalogueType = "film") {
  return db
    .prepare(
      `
                SELECT v.version, COUNT(DISTINCT w.id) AS total
                FROM works AS w
                JOIN videos AS v ON v.work_id= w.id
                WHERE w.type = ?
                GROUP BY v.version;
            `,
    )
    .all(type) as { version: string; total: number }[];
}

export function getCountVersionWithPlaylist(type: CatalogueType = "film") {
  return db
    .prepare(
      `
                SELECT p.version, COUNT(DISTINCT w.id) AS total
                FROM works AS w
                JOIN playlists AS p ON p.work_id = w.id
                WHERE w.type = ?
                GROUP BY p.version;
            `,
    )
    .all(type) as { version: string; total: number }[];
}

export function getCountVersionWithoutPlaylist(type: CatalogueType = "film") {
  return db
    .prepare(
      `
      SELECT v.version, COUNT(DISTINCT w.id) AS total
      FROM works AS w
      JOIN videos AS v ON v.work_id = w.id
      LEFT JOIN playlists AS p
        ON p.work_id = w.id
        AND p.version = v.version
      WHERE w.type = ?
        AND p.id IS NULL
      GROUP BY v.version;
    `,
    )
    .all(type) as { version: string; total: number }[];
}

export function searchFilms(
  search: string,
  page: number = 1,
  limit: number = 10,
  type: CatalogueType = "film",
): PaginatedResult<FilmRow> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("page doit être un entier positif.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("limit doit être un entier positif.");
  }

  // Les caractères spéciaux LIKE saisis sont recherchés littéralement.
  const pattern = `%${normalizeSearch(search.trim()).replace(/[\\%_]/g, "\\$&")}%`;

  const { total } = db
    .prepare(
      `
    SELECT COUNT(*) AS total
    FROM works
    WHERE type = ? AND (normalize_search(title_fr) LIKE ? ESCAPE '\\' OR normalize_search(COALESCE(title_en, '')) LIKE ? ESCAPE '\\');
  `,
    )
    .get(type, pattern, pattern) as { total: number };

  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, Math.max(1, totalPages));
  const offset = (page - 1) * limit;

  const data = db
    .prepare(
      `
    WITH selected_films AS (
      SELECT id, title_fr, title_en
      FROM works
      WHERE type = ? AND (normalize_search(title_fr) LIKE ? ESCAPE '\\' OR normalize_search(COALESCE(title_en, '')) LIKE ? ESCAPE '\\')
      ORDER BY title_fr, id
      LIMIT ? OFFSET ?
    ), versions AS (
      SELECT 'VF' AS version UNION ALL SELECT 'VO'
    )
    SELECT
      w.id,
      w.title_fr AS titleFr,
      w.title_en AS titleEn,
      versions.version,
      v.video_id AS videoId,
      p.playlist_id AS playlistId
    FROM selected_films AS w
    CROSS JOIN versions
    LEFT JOIN videos AS v ON v.work_id = w.id AND v.version = versions.version
    LEFT JOIN playlists AS p
      ON p.work_id = w.id
      AND p.version = versions.version
    ORDER BY w.title_fr, w.id, versions.version, v.video_id, p.playlist_id;
  `,
    )
    .all(type, pattern, pattern, limit, offset) as FilmRow[];

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}

export function getFilmsWithoutPlaylist() {
  return db
    .prepare(
      `
      SELECT DISTINCT w.id, w.title_fr AS titleFr, w.title_en AS titleEn, v.version
      FROM works AS w
      JOIN videos AS v ON v.work_id = w.id
      LEFT JOIN playlists AS p
        ON p.work_id = w.id
        AND p.version = v.version
      WHERE w.type = 'film'
        AND v.version IN ('VF', 'VO')
        AND p.id IS NULL
      ORDER BY w.title_fr, v.version;
      `,
    )
    .all() as FilmPlaylist[];
}
