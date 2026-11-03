import type { FilmPlaylist, FilmRow, PaginatedResult } from "./film-types";
import { db, normalizeSearch } from "@/lib/server/database";

export function getCountFilms() {
  return db
    .prepare(
      `
        SELECT COUNT(w.id) as total
        FROM works AS w
        WHERE w.type='film';
        `,
    )
    .get() as { total: number };
}

export function getCountVersion() {
  return db
    .prepare(
      `
                SELECT v.version, COUNT(DISTINCT w.id) AS total
                FROM works AS w
                JOIN videos AS v ON v.work_id= w.id
                WHERE w.type = 'film'
                GROUP BY v.version;
            `,
    )
    .all() as { version: string; total: number }[];
}

export function getCountVersionWithPlaylist() {
  return db
    .prepare(
      `
                SELECT p.version, COUNT(DISTINCT w.id) AS total
                FROM works AS w
                JOIN playlists AS p ON p.work_id = w.id
                WHERE w.type = 'film'
                GROUP BY p.version;
            `,
    )
    .all() as { version: string; total: number }[];
}

export function getCountVersionWithoutPlaylist() {
  return db
    .prepare(
      `
      SELECT v.version, COUNT(DISTINCT w.id) AS total
      FROM works AS w
      JOIN videos AS v ON v.work_id = w.id
      LEFT JOIN playlists AS p
        ON p.work_id = w.id
        AND p.version = v.version
      WHERE w.type = 'film'
        AND p.id IS NULL
      GROUP BY v.version;
    `,
    )
    .all() as { version: string; total: number }[];
}

export function searchFilms(
  search: string,
  page: number = 1,
  limit: number = 10,
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
    WHERE type = 'film' AND normalize_search(title_fr) LIKE ? ESCAPE '\\';
  `,
    )
    .get(pattern) as { total: number };

  const totalPages = Math.ceil(total / limit);
  page = Math.min(page, Math.max(1, totalPages));
  const offset = (page - 1) * limit;

  const data = db
    .prepare(
      `
    WITH selected_films AS (
      SELECT id, title_fr
      FROM works
      WHERE type = 'film' AND normalize_search(title_fr) LIKE ? ESCAPE '\\'
      ORDER BY title_fr, id
      LIMIT ? OFFSET ?
    )
    SELECT
      w.id,
      w.title_fr AS titleFr,
      v.version,
      v.video_id AS videoId,
      p.playlist_id AS playlistId
    FROM selected_films AS w
    LEFT JOIN videos AS v ON v.work_id = w.id
    LEFT JOIN playlists AS p
      ON p.work_id = w.id
      AND p.version = v.version
    ORDER BY w.title_fr, w.id, v.version, v.video_id, p.playlist_id;
  `,
    )
    .all(pattern, limit, offset) as FilmRow[];

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
      SELECT DISTINCT w.id, w.title_fr AS titleFr, v.version
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
