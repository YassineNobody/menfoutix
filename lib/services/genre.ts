import { versionSql, type CatalogueVersion } from "@/lib/catalogue";
import "server-only";

import { db } from "../server/database";
import { GenreWithBackdrop } from "@/types/genres/genres";
import { WorkType } from "@/types/work/work";


export function getGenres(
  type: WorkType,
  version: CatalogueVersion = "VO",
): GenreWithBackdrop[] {
  if (type !== "film" && type !== "série") {
    throw new Error("Type d’œuvre invalide.");
  }

  const sql = `
    SELECT
      g.tmdb_genre_id AS id,
      g.name,

      (
        SELECT w.backdrop_url
        FROM work_genres AS backdrop_wg
        JOIN works AS w ON w.id = backdrop_wg.work_id

        WHERE backdrop_wg.genre_id = g.id
          AND w.type = ?
          AND NULLIF(TRIM(w.backdrop_url), '') IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM videos AS v
            WHERE v.work_id = w.id
              AND v.version = ${versionSql(version)}
          )

        ORDER BY w.id DESC
        LIMIT 1
      ) AS backdropUrl

    FROM genres AS g

    WHERE EXISTS (
      SELECT 1
      FROM work_genres AS wg
      JOIN works AS w ON w.id = wg.work_id

      WHERE wg.genre_id = g.id
        AND w.type = ?
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id
            AND v.version = ${versionSql(version)}
        )
    )

    ORDER BY g.name COLLATE NOCASE;
  `;

  return db
    .prepare(sql)
    .all(type, type) as GenreWithBackdrop[];
}
