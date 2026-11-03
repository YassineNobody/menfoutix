import { db } from "../server/database";

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
        AND p.id IS NULL
      ORDER BY w.title_fr, v.version;
      `,
    )
    .all() as {
    version: "VF" | "VO";
    titleFr: string;
    id: number;
  }[];
}
